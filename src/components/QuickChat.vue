<template>
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
      
        <!-- <template v-slot:header>
          <div>
            <p v-for="(participant, index) in participants" :key="index" class="custom-title">{{participant.name}}</p>
          </div>
        </template> -->

        
      </Chat>
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

        inspectTableList: [],
        inspectId: null,
        inspectName: "",

        visible: true,
        participants: [
            {
                // name: 'GenieAI',
                id: 1,
                profilePicture: 'https://uc8f5ea4122c2853ee970fd28fac.previews.dropboxusercontent.com/p/thumb/ACaQroGcwS9vLB6I95xbpJXEMIC312JDFrPmH3d8T4higHyABummKL-Q4OH91lmXWvGUlgdUdhU82ERDebavsL208TAmeZQqCQ8FVIww6a5ZBXwDuapxG3c_UgD_TBV16sYu96TqJBVXDNZdVr6eWp0uHR7___XffhDk3MDJHxO9TYzq9spNJ8jXVLYzKQ2C-dk9d-bjqBgu19IhyEolN0aWowlgWShbnPIdlKdxkgT1oA2iVuDEAHt_cXhqtM8N5xuczalitAMwepj84-oCv-dt_b4kg-1NjHVYYVnn0A3jQQtHp7RxN9_p3zkEN2MqNqF9tCS0kkL6j2zqNDZ-JB0HgQueoDtxlGK8arH2U26y6kbXO77BOnjRk5cUmqg_FEjkXmha3mOIpgmvCsEN691L/p.jpeg?is_prewarmed=true'
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
        chatTitle: 'My chat title',
        placeholder: 'send your message XDXD',
        colors: {
            header: {
                bg: '#d30303',
                text: '#fff'
            },
            message: {
                myself: {
                    bg: '#fff',
                    text: '#bdb8b8'
                },
                others: {
                    bg: '#fb4141',
                    text: '#fff'
                },
                messagesDisplay: {
                    bg: '#f7f3f3'
                }
            },
            submitIcon: '#b91010',
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
        }
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


      async fetchAi(message){

        // var aaa = massage.content
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

            // 将缓存的文本加上新获取的文本
            this.bufferedText += text;

            // 处理 SSE 数据流格式（按行处理）
            const parts = this.bufferedText.split(/\n\n/);

            console.log('parts :>> ', parts );
            let result = parts[0].includes("text_chunk");
            if(result) console.log('!!!!!!! :>> ')
            

            // 最后一部分可能是未完整的一行数据，因此先保留在 `bufferedText` 中
            this.bufferedText = parts.pop();  // 获取最后未完成的数据

            
            parts.forEach(part => {
              if (part.startsWith('data:')) {
                const message = part.replace('data:', '').trim();
                const obj = JSON.parse(message)
                if(obj.event !== 'text_chunk') {
                    return
                  }
                  else {                    
                    // 模拟逐字输出
          
                    this.messages[this.messageLength - 1].content += obj.data.text
                  }  
              }
            });

            // 重置 `text` 以便于下一轮读取
            text = '';
          }
        } catch (error) {
          console.error('SSE error', error);
        }

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
      
      async onMessageSubmit (message) {

          /*
          * example simulating an upload callback. 
          * It's important to notice that even when your message wasn't send 
          * yet to the server you have to add the message into the array
          */
          this.messages.push(message);
          console.log('message :>> ', message);

          // await this.fetchAi(message)
          // console.log('this.messages !!!!!:>> ', this.messages[this.messages.length-1]);

        var aaa =  {
              content: 'received messages', 
              myself: false,
              participantId: 1,
              timestamp: {year: 2019, month: 4, day: 5, hour: 19, minute: 50, second: 3, millisecond: 123},
              uploaded: true,
              viewed: true,
              preview: 'blob:https://cdn.pixabay.com/photo/2024/09/25/15/53/japan-9074037_640.jpg',
              src: 'https://cdn.pixabay.com/photo/2024/09/25/15/53/japan-9074037_640.jpg',
              type: 'image',
            }
        
        this.messages.push(aaa);
          /*
          * you can update message state after the server response
          */
          // timeout simulating the request
          // setTimeout(() => {
          //     message.uploaded = true
          // }, 2000)
      },
      onClose() {
          this.visible = false;
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
          console.log('Image clicked', message.src)
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
</style>