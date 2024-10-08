<template>
  <div>
    <!-- <div class="test" 
    style="
      background: #789;
      width: 100%;
      font-size: 12px;
      color: #FFF;
      background: rgb(119, 136, 153);
      position: fixed;
      z-index: 999;">
    mesageDataXDXD :{{ mesageDataXDXD }}
    </div> -->

    <beautiful-chat
      :participants="participants"
      :titleImageUrl="titleImageUrl"
      :onMessageWasSent="onMessageWasSent"
      :messageList="messageList"
      :newMessagesCount="newMessagesCount"
      :isOpen="isChatOpen"
      :close="closeChat"
      :open="openChat"
      :showEmoji="false"
      :showFile="false"
      :showEdition="false"
      :showDeletion="true"
      :deletionConfirmation="true"
      :showTypingIndicator="showTypingIndicator"
      :showLauncher="true"
      :showCloseButton="true"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :disableUserListToggle="false"
      :messageStyling="messageStyling"
      @onType="handleOnType"
      @edit="editMessage" />
  </div>
</template>

<script>
  import { getToken } from '@/common/auth.js';
  export default {
    name: 'app',
    data() {
      return {
        participants: [
          {
            id: 'genieai',
            name: 'Genie AI',
            imageUrl: `https://api.iconify.design/mdi:robot.svg?color=%234e8cff`
          }
        ], // the list of all the participant of the conversation. `name` is the user name, `id` is used to establish the author of a message, `imageUrl` is supposed to be the user avatar.
        titleImageUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='2em' height='2em' viewBox='0 0 24 24'%3E%3Cg fill='none'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='%23ffffff' d='M9.107 5.448c.598-1.75 3.016-1.803 3.725-.159l.06.16l.807 2.36a4 4 0 0 0 2.276 2.411l.217.081l2.36.806c1.75.598 1.803 3.016.16 3.725l-.16.06l-2.36.807a4 4 0 0 0-2.412 2.276l-.081.216l-.806 2.361c-.598 1.75-3.016 1.803-3.724.16l-.062-.16l-.806-2.36a4 4 0 0 0-2.276-2.412l-.216-.081l-2.36-.806c-1.751-.598-1.804-3.016-.16-3.724l.16-.062l2.36-.806A4 4 0 0 0 8.22 8.025l.081-.216zM19 2a1 1 0 0 1 .898.56l.048.117l.35 1.026l1.027.35a1 1 0 0 1 .118 1.845l-.118.048l-1.026.35l-.35 1.027a1 1 0 0 1-1.845.117l-.048-.117l-.35-1.026l-1.027-.35a1 1 0 0 1-.118-1.845l.118-.048l1.026-.35l.35-1.027A1 1 0 0 1 19 2'/%3E%3C/g%3E%3C/svg%3E`,
        messageList: [
            { 
              type: 'text', 
              author: `genieai`, 
              data: { 
                text: `hi` ,
                // meta: '06-16-2019 12:43'
              },
              suggestions: []
            },
            // { 
            //   type: 'text', 
            //   author: `genieai`, 
            //   data: { 
            //     text: "" ,
            //     // meta: '06-16-2019 12:43'
            //   },
            //   suggestions: []
            // },

            // { 
            //   type: 'text', 
            //   author: `me`, 
            //   data: { 
            //     text: `Say yes!` 
            //   } 
            // },

        ], // the list of the messages to show, can be paginated and adjusted dynamically
        newMessagesCount: 0,
        isChatOpen: false, // to determine whether the chat window should be open or closed
        showTypingIndicator: '', // when set to a value matching the participant.id it shows the typing indicator for the specific user
        colors: {
          header: {
            bg: '#4e8cff',
            text: '#ffffff'
          },
          launcher: {
            bg: '#4e8cff'
          },
          messageList: {
            bg: '#ffffff'
          },
          sentMessage: {
            bg: '#4e8cff',
            text: '#ffffff'
          },
          receivedMessage: {
            bg: '#eaeaea',
            text: '#222222'
          },
          userInput: {
            bg: '#f4f7f9',
            text: '#565867'
          }
        }, // specifies the color scheme for the component
        alwaysScrollToBottom: false, // when set to true always scrolls the chat to the bottom when new events are in (new message, user starts typing...)
        messageStyling: true, // enables *bold* /emph/ _underline_ and such (more info at github.com/mattezza/msgdown)

        currentToken: '',
        currentQuestion: '',
        messageLength: 2,
        mesageDataXDXD: '',
        bufferedText: '', // 用于保存未完整处理的流数据
      }
    },
    mounted() {
      this.currentToken = getToken()
    },
    methods: {

      async fetchAi(){
        const params = {
          "inputs": {
              "text": this.currentQuestion,
              "token": this.currentToken,
              "inspectTagId": "hsBYs88ENh9S"
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
            var ai = {
                type: 'text', 
                author: `genieai`, 
                data: { 
                  text: '' ,
                },
              }

              this.messageList = [ ...this.messageList, ai ]
              this.messageLength = this.messageList.length
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
                    
                    this.messageList[this.messageLength - 1].data.text += obj.data.text
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
      
      sendMessage (text) {
        if (text.length > 0) {
          this.newMessagesCount = this.isChatOpen ? this.newMessagesCount : this.newMessagesCount + 1
          this.onMessageWasSent({ author: 'support', type: 'text', data: { text } })
        }
      },
      async onMessageWasSent (message) {
        // called when the user sends a message
        console.log('sending :>> ' , message);
        this.messageList = [ ...this.messageList, message ]
        this.currentQuestion  = message.data.text

  
        this.showTypingIndicator = 'genieai'
        await this.fetchAi()

    

        
      },
      openChat () {
        // called when the user clicks on the fab button to open the chat
        this.isChatOpen = true
        this.newMessagesCount = 0
        
    
      },

      
      closeChat () {
        // called when the user clicks on the botton to close the chat
        this.isChatOpen = false
      },
      handleScrollToTop () {
        // called when the user scrolls message list to top
        // leverage pagination for loading another page of messages
      },
      handleOnType () {
        console.log('Emit typing event')
      },
      editMessage(message){
        const m = this.messageList.find(m=>m.id === message.id);
        m.isEdited = true;
        m.data.text = message.data.text;
      }
    }
  }
</script>
<style lang="sass">
  .sc-message 
    width: 95% !important
    text-align: left
  .sc-message--meta
    text-align: left
  .sc-user-input
    text-align: left
  .sc-message--text
    padding: 5px 10px !important
  .sc-message--text-content
    margin: 5px 0
  .sc-suggestions-row
    margin-bottom: 8px
  .sc-chat-window
    z-index: 999
  .sc-message--avatar
    align-self: flex-start
    margin-top: 2px
    margin-right: 10px
  .sc-typing-indicator
    padding: 10px 10px !important
</style>