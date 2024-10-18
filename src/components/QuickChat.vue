<template>
  <div>
    <div class="test" 
      style="
        background: #789;
        width: 800px;
        font-size: 14px;
        color: #FFF;
        background: rgba(255, 255, 255, 1);
        border: 1px solid #555;
        position: fixed;
        padding: 10px;
        top: -999%;
        left: -999%;
        z-index: 1;">
          <canvas  ref="myChart"></canvas>
    </div>

    <Chat v-if="visible"
        :participants="participants"
        :myself="myself"
        :messages="messages"
        :chat-title="chatTitle"
        :placeholder="placeholder"
        :colors="colors"
        :border-style="borderStyle"
        :hide-close-button="hideCloseButton"
        :close-button-icon-size="closeButtonIconSize"
        :submit-icon-size="submitIconSize"
        :submit-image-icon-size="submitImageIconSize"
        :load-more-messages="toLoad.length > 0 ? loadMoreMessages : null"
        :async-mode="asyncMode"
        :scroll-bottom="scrollBottom"
        :display-header="true"
        :send-images="false"
        :profile-picture-config="profilePictureConfig"
        :timestamp-config="timestampConfig"
        :link-options="linkOptions"
        :accept-image-types="'.png, .jpeg'"

        :displayHeader = "displayHeader"
        @onImageClicked="onImageClicked"
        @onImageSelected="onImageSelected"
        @onMessageSubmit="onMessageSubmit"
        @onType="onType"
        @onClose="onClose">
      
        <template v-slot:header>
          <div class=""><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><g fill="none"><path d="m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z"/><path fill="#fcfcfc" d="M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2"/></g></svg></div>
          <h6 style="font-size: 14px; line-height: 0; color: #FFF;">GenieAI</h6>
          <el-select
            class="el-province ai_header_input "
            style="
              width: 50% ; 
              margin-left: 20px;
              border:none;
              border-radius:0px;
              background-color: rgba(255, 255, 255, 0.2); "
              v-model="inspectId"
              placeholder="請選擇巡檢表"
              size="mini"
              @change="onChange"
              >
            <el-option
              v-for="(item,index) in inspectTableList"
              :key="index"
              :label="item.name"
              :value="item.id"/>
          </el-select> 
        </template>
      </Chat>

      <div class="switch_wrap">
        <div class="switch" @click.prevent="onClose">
            <img src="https://api.iconify.design/mingcute:ai-fill.svg?color=%23fcfcfc" alt="">
        </div>
      </div>
      
      
  </div>
</template>

<script>
  import { Chat } from 'vue-quick-chat'
  import 'vue-quick-chat/dist/vue-quick-chat.css';

  import { getToken } from '@/common/auth.js';
  import PermissionHelper from '@/api/PermissionHelper';
  import { 
      getInspectReportList, 
      GetInspectTagList,
      downLoadInspectReportEntireDetail,
      getAllReportIds,
      GetMysteryInspectTagList ,
      getInspectStatus,
      getInspectReportInfo
    } from '@/api/inspect';
  import Chart from 'chart.js'
import jsCookie from 'js-cookie';

  export default {
    name: 'app',
    components: {
        Chat
    },
    
    data() {
      return {
        submitImageIconSize: 24,
        currentToken: '',

        currentQuestion: '',
        messageLength: 2,
        mesageDataXDXD: '',
        bufferedText: '', // 用于保存未完整处理的流数据
        bufferedText_n: '', // 用于保存未完整处理的流数据

        inspectTableList: [],
        inspectId: null,
        inspectName: "",

        visible: true,
        participants: [
            {
                // name: 'GenieAI',
                id: 1,
                profilePicture: `https://api.iconify.design/mdi:robot.svg?color=%234e8cff`
            },
            // {
            //     name: 'José',
            //     id: 2,
            //     profilePicture: 'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg'
            // }
        ],
        myself: {
            // name: 'Albert D.',
            id: 3,
            profilePicture: 'https://lh3.googleusercontent.com/-G1d4-a7d_TY/AAAAAAAAAAI/AAAAAAAAAAA/AAKWJJPez_wX5UCJztzEUeCxOd7HBK7-jA.CMID/s83-c/photo.jpg'
        },
        messages: [
            {
                content: 'hello',
                myself: false,
                participantId: 1,
                timestamp: {year: 2019, month: 3, day: 5, hour: 20, minute: 10, second: 3, millisecond: 123},
                type: 'text'
            },
            // {
            //     content: 'sent messages ===> 2',
            //     myself: true,
            //     participantId: 1,
            //     timestamp: {year: 2019, month: 4, day: 5, hour: 19, minute: 10, second: 3, millisecond: 123},
            //     type: 'text'
            // },
            // {
            //   content: 'received messages', 
            //   myself: false,
            //   participantId: 1,
            //   timestamp: {year: 2019, month: 4, day: 5, hour: 19, minute: 50, second: 3, millisecond: 123},
            //   uploaded: true,
            //   viewed: true,
            //   preview: 'blob:https://cdn.pixabay.com/photo/2024/09/25/15/53/japan-9074037_640.jpg',
            //   src: 'https://cdn.pixabay.com/photo/2024/09/25/15/53/japan-9074037_640.jpg',
            //   type: 'image',
            // },
          
        ],
        toLoad: [
            // {
            //     content: 'Hey, John Doe! How are you today?',
            //     myself: false,
            //     participantId: 1,
            //     timestamp: {year: 2011, month: 3, day: 5, hour: 10, minute: 10, second: 3, millisecond: 123},
            //     uploaded: true,
            //     viewed: true,
            //     type: 'text'
            // },
            // {
            //     content: "Hey, Adam! I'm feeling really fine this evening.",
            //     myself: true,
            //     participantId: 3,
            //     timestamp: {year: 2019, month: 4, day: 5, hour: 19, minute: 10, second: 3, millisecond: 123},
            //     uploaded: true,
            //     viewed: true,
            //     type: 'text'
            // },
            // {
            //   content: 'received messages', 
            //   myself: false,
            //   participantId: 1,
            //   timestamp: {year: 2019, month: 4, day: 5, hour: 19, minute: 50, second: 3, millisecond: 123},
            //   uploaded: true,
            //   viewed: true,
            //   preview: 'blob:https://cdn.pixabay.com/photo/2024/09/25/15/53/japan-9074037_640.jpg',
            //   src: 'https://cdn.pixabay.com/photo/2024/09/25/15/53/japan-9074037_640.jpg',
            //   type: 'image',
            // },
        ],
        chatTitle: 'GenieAI',
        placeholder: 'send your message',
        colors: {
            header: {
                bg: '#246ffb',
                text: '#fff'
            },
            message: {
                myself: {
                    bg: '#fff',
                    text: '#888'
                },
                others: {
                    bg: '#4e8cff',
                    text: '#fff'
                },
                messagesDisplay: {
                    bg: '#f7f3f3'
                }
            },
            submitIcon: '#4e8cff',
            submitImageIcon: '#b91010',
        },
        borderStyle: {
            topLeft: "10px",
            topRight: "10px",
            bottomLeft: "10px",
            bottomRight: "10px",
        },
        hideCloseButton: false,
        submitIconSize: 25,
        closeButtonIconSize: "20px",
        asyncMode: false,
        
        scrollBottom: {
            messageSent: true,
            messageReceived: false
        },
        displayHeader: true,
        profilePictureConfig: {
            others: true,
            myself: false,
            styles: {
                width: '30px',
                height: '30px',
                borderRadius: '50%'
            }
        },
        timestampConfig: {   
            format: 'HH:mm',
            relative: false
        },
        // there are other options, you can check them here
        // https://soapbox.github.io/linkifyjs/docs/options.html
        linkOptions: {
            myself: {
                className: 'myLinkClass',
                events: {
                    click: function (e) {
                        alert('Link clicked!');
                    },
                    mouseover: function (e) {
                        alert('Link hovered!');
                    }
                },
                format: function (value, type) {
                    if (type === 'url' && value.length > 50) {
                        value = value.slice(0, 50) + '…';
                    }
                    return value;
                }
            },
            others: {
                className: 'othersLinkClass',
                events: {
                    click: function (e) {
                        alert('Link clicked!');
                    },
                    mouseover: function (e) {
                        alert('Link hovered!');
                    }
                },
                format: function (value, type) {
                    if (type === 'url' && value.length > 50) {
                        value = value.slice(0, 50) + '…';
                    }
                    return value;
                }
            }
        },

        imgUrl: "",
        chartData : []
      }
    },
    mounted() {
      this.currentToken = getToken()
      this.getInspectList()
    },

    methods: {
        // get inspect for AI
      async getInspectList() {
        const self = this;
        const inspectArr = PermissionHelper.enableMimicMode ? await self.getTagMytery() : await self.getTagAll();
        const newArr = [];
        // const inspectList = [];

        console.log('inspectArr :>> ', inspectArr);
        var inspectList = inspectArr.filter(i => i.mode == 1)
        self.inspectTableList = inspectList;
        if (inspectList.length !== 0) {
          self.inspectId = self.ifGetParamsFromCash ? self.inspectCatch : self.inspectTableList[0].id;
        } else {
          self.inspectId = '';
        }
        this.inspectName = this.inspectTableList.find( i => i.id == this.inspectId).name
      },

      onChange(){
        this.inspectName = this.inspectTableList.find( i => i.id == this.inspectId).name
      },

      getTagAll() {
        return new Promise((resolve, reject) => {
          GetInspectTagList().then(res => {
            const data = res.data;
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },

      getTagMytery() {
        return new Promise((resolve, reject) => {
          GetMysteryInspectTagList().then(res => {
            const data = res.data;
            resolve(data);
          }).catch(err => {
            reject(err);
          });
        });
      },

      onType: function (event) {
          //here you can set any behavior
      },
      loadMoreMessages(resolve) {
          setTimeout(() => {
              resolve(this.toLoad); //We end the loading state and add the messages
              //Make sure the loaded messages are also added to our local messages copy or they will be lost
              this.messages.unshift(...this.toLoad);
              this.toLoad = [];
          }, 1000);
      },
      

      async fetchAi(message){
        const params = {
          "inputs": {
              "text": message.content,
              "token": this.currentToken,
              "inspectTagId": this.inspectId.toString(),
              "inspectName": this.inspectName
          },
          "response_mode": "blocking",
          "user": "abc-123"
        }
        const url = 'https://app.genieai.wise-paas.com.cn/api/workflows/run'
        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJiMGVmZTAxNi05OTYxLTQ5NWMtYjcwMC02N2NkOTdmZmYyMTQiLCJzdWIiOiJXZWIgQVBJIFBhc3Nwb3J0IiwiYXBwX2lkIjoiYjBlZmUwMTYtOTk2MS00OTVjLWI3MDAtNjdjZDk3ZmZmMjE0IiwiYXBwX2NvZGUiOiJ0Q2hscHRsbkZMUHp5RFJhIiwiZW5kX3VzZXJfaWQiOiJiNzM1NTQxYS00N2QwLTQxMjYtYjliOC1iN2MxOGRkZjE1ZDUifQ._7xMoVgUNbjVmgoHecT-EZNLvQHXSfrrf67vxBra1rY'

        try {
          // 发送带有 header 和 body 的 POST 请求
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,  // 示例的 header
            },
            body: JSON.stringify(params),  // POST 请求体
          });

          // 检查响应是否成功
          if (!response.ok) {
            throw new Error('Network response was not ok');
          } 
          else {
            this.showTypingIndicator = ''
            var aiMessage = {
                  content: '',
                  myself: false,
                  participantId: 1,
                  // timestamp: {year: 2019, month: 4, day: 5, hour: 19, minute: 10, second: 3, millisecond: 123},
                  type: 'text'
              }
            this.messages = [ ...this.messages, aiMessage ]
            this.messageLength = this.messages.length
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder('utf-8');

          // 逐字读取消息
          let text = '';
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
      
            text += decoder.decode(value, { stream: true });
            console.log('text :>> ', text);

            // 将缓存的文本加上新获取的文本
            this.bufferedText += text;

            // 处理 SSE 数据流格式（按行处理）
            const parts = this.bufferedText.split(/\n\n/);
            console.log('parts :>> ', parts );
            // let result = parts[0].includes("text_chunk");
            // if(result) console.log('!!!!!!! :>> ')
            
            // 最后一部分可能是未完整的一行数据，因此先保留在 `bufferedText` 中
            this.bufferedText = parts.pop();  // 获取最后未完成的数据

            if(parts[0].includes("*****"))  break;
            parts.forEach(part => {
              if (part.startsWith('data:')) {
                const message = part.replace('data:', '').trim();
                const obj = JSON.parse(message)

                if(obj.event !== 'text_chunk') return
                // 模拟逐字输出
                this.messages[this.messageLength - 1].content += obj.data.text
              }
            });
            // 重置 `text` 以便于下一轮读取
            text = '';
          }

          // ------ 取 this.chart Data json -------
          var chartData = ""
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            
            text += decoder.decode(value, { stream: true });
            // 将缓存的文本加上新获取的文本
            this.bufferedText += text;
            // 处理 SSE 数据流格式（按行处理）
            const parts = this.bufferedText.split(/\n\n/);
            // let result = parts[0].includes("text_chunk");
            // if(result) console.log('!!!!!!! :>> ')
            
            // 最后一部分可能是未完整的一行数据，因此先保留在 `bufferedText` 中
            this.bufferedText = parts.pop();  // 获取最后未完成的数据
            parts.forEach(part => {
              if (part.startsWith('data:')) {
                const message = part.replace('data:', '').trim();
                const obj = JSON.parse(message)

                if(obj.event !== 'text_chunk') return
                // 模拟逐字输出
                chartData += obj.data.text
              }
            });
            text = '';
          }
        
          console.log('chartData :>> ', chartData);
          const regex = /\*{5}([\s\S]*?)\*{5}/;
          const match = chartData.match(regex);
          if (match) {
            const jsonString = match[1].replace(/\s+/g, "");

            const jsonData = JSON.parse(jsonString);
            console.log("jsonData" , jsonData);

            const title = jsonData.title
            var type = jsonData.type
            var labels = []
            var infoData = []

            jsonData.count.forEach(i => {
              labels.push(i.label)
              infoData.push(i.number)
            })
            
            console.log('labels :>> ', labels);
            console.log('infoData :>> ', infoData);
            this.addChartAndMessage(title, type, labels, infoData)

          } else {
            console.error("未找到符合格式的 JSON 資料");
          }
        } catch (error) {
          console.error('SSE error', error);
        }
      }, 


      async addChartAndMessage(title, type, labels, infoData){
        await this.createChart(title, type, labels, infoData)
        this.getImageUrl() 
      },

      async createChart(title, type, labels, infoData){
        return new Promise((resolve) => {
          console.log('createChart :>> ' ,title, type, labels, infoData );
          const ctx = this.$refs.myChart.getContext('2d');
          new Chart(ctx, {
            type: type,
            data: {
              labels: labels,
              datasets: [
                { 
                  label: title, 
                  data: infoData,
                  backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)',
                    'rgb(255, 205, 86)',
                    'rgb(155, 205, 86)',
                    'rgb(255, 105, 86)',
                    'rgb(255, 5, 86)',
                  ]
                }
              ],
              
            },
          });

          setTimeout(() => {
            resolve();
          }, 1000);
        })
      },

      getImageUrl() {
        console.log('getImageUrl :>> ');
        const canvas = this.$refs.myChart;
        const dataURL = canvas.toDataURL('image/png'); // 將 canvas 轉換為 PNG 格式的 base64 數據
        this.imgUrl = dataURL
        // console.log('dataURL :>> ', dataURL);
        this.aiMessage()

        // const link = document.createElement('a');
        // link.href = dataURL;
        // link.download = 'myChart.png'; // 設置下載檔名
        // link.click();
      },
      async aiMessage(){
        console.log('aiMessage :>> ');
        var addMessage =  {
          content: 'received messages', 
          myself: false,
          participantId: 1,
          timestamp: {year: 2019, month: 4, day: 5, hour: 19, minute: 50, second: 3, millisecond: 123},
          uploaded: true,
          viewed: true,
          preview: 'blob:' + this.imgUrl,
          src: this.imgUrl,
          type: 'image',
        }
        
        this.messages.push(addMessage);
      },

      async onMessageSubmit (message) {
        /*
        * example simulating an upload callback. 
        * It's important to notice that even when your message wasn't send 
        * yet to the server you have to add the message into the array
        */
        this.messages.push(message);
        console.log('message :>> ', message);

        await this.fetchAi(message)
        // console.log('this.messages !!!!!:>> ', this.messages[this.messages.length-1]);
        // await this.addChartAndMessage()


          /*
          * you can update message state after the server response
          */
          // timeout simulating the request
          // setTimeout(() => {
          //     message.uploaded = true
          // }, 2000)
      },
      onClose() {
          this.visible = !this.visible;
      },
      onImageSelected(files, message){
          let src = 'https://149364066.v2.pressablecdn.com/wp-content/uploads/2017/03/vue.jpg'
          this.messages.push(message);
          /**
           * This timeout simulates a requisition that uploads the image file to the server.
           * It's up to you implement the request and deal with the response in order to
           * update the message status and the message URL
           */
          setTimeout((res) => {
              message.uploaded = true
              message.src = res.src
          }, 3000, {src});
      },
      onImageClicked(message){
        /**
         * This is the callback function that is going to be executed when some image is clicked.
         * You can add your code here to do whatever you need with the image clicked. A common situation is to display the image clicked in full screen.
         */
        // console.log('Image clicked', message.src)

        const link = document.createElement('a');
        link.href = message.src;
        link.download = 'myChart.png'; // 設置下載檔名
        link.click();

      }
    }
  }
</script>
<style lang="sass">
  
  .container-message-display
    min-height: 400px !important
    overflow: auto !important
  .message-text
    line-height: 1.2 !important
  .header-paticipants-text
    display: none
  .quick-chat-container
    box-shadow: 0 7px 40px 2px rgba(148, 149, 150, .5);
  .quick-chat-container .header-container .header-title-text 
    margin-bottom: revert
  .container-message-display
    background: #f3f4f7 !important
    max-height: 500px !important

  .switch_wrap
    width: 100% 
    display: flex
    flex-direction: row
    justify-content: flex-end
    align-items: center

    .switch
      width: 60px
      height: 60px
      background: rgb(36, 111, 251)
      border-radius: 50%
      margin-top: 30px
      display: flex
      flex-direction: row
      justify-content: center
      align-items: center
      box-shadow: 0 7px 40px 2px rgba(148, 149, 150, .5);
      cursor: pointer
      transition: all .3s
      &:hover
        box-shadow: 0 7px 20px 2px rgba(148, 149, 150, .9);
        img
          transform: scale(1.2)
      img
        width: 30px
        height: 30px
        transition: all .2s
</style>


