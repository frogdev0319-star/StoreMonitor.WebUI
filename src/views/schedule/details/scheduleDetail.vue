<template>
  <div class="schedule_setting">
    <div class="search-bar">
      <div style="font-size:calc(18/1920*100vw)">排程設定</div>
      <div style="flex:2"></div>
      <delay-button
          class="search-button"
          type="filled"
          size="mini"
          >
          <span>儲存</span>
      </delay-button>
    </div>

    <!-- 基本訊息 -->
    <div class="page-container report-setting paper" style="margin-bottom: 40px">
      <div class="setting-titles padding flex-center">
        基本訊息
        <div class="spacer"></div>
      </div>

      <div v-loading="isLoadingData" class="setting-details self-loading">
        <div class="inspect-basic flex-row">
          <div class="setting-config">
            <!-- 排程名稱 -->
            <div class="flex-row" style="margin-right: 30px">
              <div class="title-name"><span style="color: #c60957">* </span>排程名稱</div>
              <div class="title-status"> 
                <el-input
                  ref="inputName"
                  class="ppip"
                  style="width: 250px"
                  />
              </div>
            </div>

            <!-- 排程名稱 -->
            <div class="flex-row" style="margin-right: 30px">
              <div class="title-name"><span style="color: #c60957">* </span> 巡檢表</div>
              <div class="title-status" style="margin-right: 10px"> 
                <el-select
                  placeholder="巡檢表"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(item, index) in inspectionStyle"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
              <div class="title-status"> 
                <el-select
                  placeholder="巡檢表名稱"
                  style="width: 250px"
                  >
                  <el-option
                    v-for="(item, index) in templateList"
                    :key="index"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
            </div>
        </div>

        </div>
      </div>
    </div>

    <!-- 巡檢門店 -->
    <div class="page-container report-setting paper" >
      <div class="setting-titles padding flex-center">
        巡檢門店（請設定為當地時間）
        <div class="spacer"></div>

        <div class="flex-row" style="margin-right: 30px">
          <div class="title-name">關鍵字</div>
          <div class="title-status" > 
            <el-input
              ref="inputName"
              class="ppip"
              style="width: 250px"
              />
          </div>
        </div>
        <div class="buttons">
          <!-- 加入門店 -->
          <delay-button
            class="red_border"
            type="primary"
            size="mini"
            @click="showingAddStore = true"
            >
            <span> + 加入門店</span>
          </delay-button>

          <!-- 編輯 -->
          <delay-button
            class="blue_border"
            type="primary"
            size="mini"
            @click="showingEditStore = true"
            >
            <span>編輯</span>
          </delay-button>
          
          <!-- 刪除 -->
          <delay-button
            class="blue_border"
            type="primary"
            size="mini"
            >
            <span>刪除</span>
          </delay-button>
        </div>
      </div>


      <div v-loading="isLoadingData" class="setting-details self-loading">
        <div class="inspect-basic empty_data" v-if="!scheDuleData">
          <img
            :src="emptyData"
            alt="emptyData"
          />
          <p style="color: #b7c7df">暫無數據</p>

        </div>
        
        <div class="inspect-basic flex-column" v-if="scheDuleData">
          <!-- 全部門店 -->
          <div class="role-all-checkbox" style="margin-bottom: 25px">
            <el-checkbox
              v-model="tempboolean_1" 
              class="storevue-checkbox-filled" 
              style="margin-right: 8px"
            />
            <span class="group-name">全部門店</span>
          </div>

          <!-- 門店 -->
          <div class="store_list flex-column">
            <!-- 區域 -->
            <div class="role-all-checkbox" style="margin-bottom: 10px">
              <el-checkbox
                v-model="tempboolean_2" 
                class="storevue-checkbox-filled" 
                style="margin-right: 8px"
              />
              <span class="group-name">桃園市 - 龜山區</span>
            </div>
            
            <div class="task_list flex-column">
              <div class="task_list_store flex-column">
                <!-- 店名 -->
                <div class="" style="margin-bottom: 10px">
                  <el-checkbox
                    class="storevue-checkbox-outlined"
                    v-model="tempboolean_2"
                    style="margin-right: 8px"
                    />
                    <span class="role-name">研華林口店</span>
                </div>
                <div class="memo_setting">
                  <!-- 提醒日期 -->
                  <div class="remider_setting flex-column">
                    <p>提醒日期</p>
                    <el-date-picker
                      v-model="value1"
                      type="date"
                      placeholder="提醒日期">
                    </el-date-picker>
                  </div>
                  <!-- 提醒時間 -->
                  <div class="remider_setting flex-column">
                    <p>提醒時間</p>
                    <el-time-select
                      v-model="value2"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '23:00'
                      }"
                      placeholder="提醒時間">
                    </el-time-select>
                  </div>

                  <!-- 提醒方式 -->
                  <div class="remider_setting flex-column">
                    <p>提醒方式</p>
                    <el-select
                      v-model="value3"
                      multiple
                      filterable
                      :loading="loading" 
                      style="width:300px">
                      <el-option
                        v-for= "(item, index) in remiderStyle"
                        :key="index"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="remider_setting flex-column">
                    <div class="clear_all">重設</div> 
                  </div>
                </div>
              </div>

              <div class="task_list_store flex-column">
                <!-- 店名 -->
                <div class="" style="margin-bottom: 10px">
                  <el-checkbox
                    class="storevue-checkbox-outlined"
                    v-model="tempboolean_2"
                    style="margin-right: 8px"
                    />
                    <span class="role-name">研華內湖店</span>
                </div>
                <div class="memo_setting">
                  <!-- 提醒日期 -->
                  <div class="remider_setting flex-column">
                    <p>提醒日期</p>
                    <el-date-picker
                      v-model="value1"
                      type="date"
                      placeholder="提醒日期">
                    </el-date-picker>
                  </div>
                  <!-- 提醒時間 -->
                  <div class="remider_setting flex-column">
                    <p>提醒時間</p>
                    <el-time-select
                      v-model="value2"
                      :picker-options="{
                        start: '00:00',
                        step: '01:00',
                        end: '23:00'
                      }"
                      placeholder="提醒時間">
                    </el-time-select>
                  </div>

                  <!-- 提醒方式 -->
                  <div class="remider_setting flex-column">
                    <p>提醒方式</p>
                    <el-select
                      v-model="value3"
                      multiple
                      filterable
                      :loading="loading" 
                      style="width:300px">
                      <el-option
                        v-for= "(item, index) in remiderStyle"
                        :key="index"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                  </div>
                  <div class="remider_setting flex-column">
                    <div class="clear_all">重設</div> 
                  </div>
                </div>
              </div>
          </div>
        </div>


        <div class="store_list flex-column">
          <!-- 區域 -->
          <div class="role-all-checkbox" style="margin-bottom: 10px">
            <el-checkbox
              v-model="tempboolean_2" 
              class="storevue-checkbox-filled" 
              style="margin-right: 8px"
            />
            <span class="group-name">新北市 - 板橋區</span>
          </div>
          
          <div class="task_list flex-column">
            <div class="task_list_store flex-column">
              <!-- 店名 -->
              <div class="" style="margin-bottom: 10px">
                <el-checkbox
                  class="storevue-checkbox-outlined"
                  v-model="tempboolean_2"
                  style="margin-right: 8px"
                  />
                  <span class="role-name">研華林口店</span>
              </div>
              <div class="memo_setting">
                <!-- 提醒日期 -->
                <div class="remider_setting flex-column">
                  <p>提醒日期</p>
                  <el-date-picker
                    v-model="value1"
                    type="date"
                    placeholder="提醒日期">
                  </el-date-picker>
                </div>
                <!-- 提醒時間 -->
                <div class="remider_setting flex-column">
                  <p>提醒時間</p>
                  <el-time-select
                    v-model="value2"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '23:00'
                    }"
                    placeholder="提醒時間">
                  </el-time-select>
                </div>

                <!-- 提醒方式 -->
                <div class="remider_setting flex-column">
                  <p>提醒方式</p>
                  <el-select
                    v-model="value3"
                    multiple
                    filterable
                    :loading="loading" 
                    style="width: 300px">
                    <el-option
                      v-for= "(item, index) in remiderStyle"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="remider_setting flex-column">
                  <div class="clear_all">重設</div> 
                </div>
              </div>
            </div>

            <div class="task_list_store flex-column">
              <!-- 店名 -->
              <div class="" style="margin-bottom: 10px">
                <el-checkbox
                  class="storevue-checkbox-outlined"
                  v-model="tempboolean_2"
                  style="margin-right: 8px"
                  />
                  <span class="role-name">研華內湖店</span>
              </div>
              <div class="memo_setting">
                <!-- 提醒日期 -->
                <div class="remider_setting flex-column">
                  <p>提醒日期</p>
                  <el-date-picker
                    v-model="value1"
                    type="date"
                    placeholder="提醒日期">
                  </el-date-picker>
                </div>
                <!-- 提醒時間 -->
                <div class="remider_setting flex-column">
                  <p>提醒時間</p>
                  <el-time-select
                    v-model="value2"
                    :picker-options="{
                      start: '00:00',
                      step: '01:00',
                      end: '23:00'
                    }"
                    placeholder="提醒時間">
                  </el-time-select>
                </div>

                <!-- 提醒方式 -->
                <div class="remider_setting flex-column">
                  <p>提醒方式</p>
                  <el-select
                    v-model="value3"
                    multiple
                    filterable
                    :loading="loading" 
                    style="width:300px">
                    <el-option
                      v-for= "(item, index) in remiderStyle"
                      :key="index"
                      :label="item"
                      :value="item">
                    </el-option>
                  </el-select>
                </div>
                <div class="remider_setting flex-column">
                  <div class="clear_all">重設</div> 
                </div>
              </div>
            </div>
        </div>
      </div>

        </div>
      </div>
    </div>

    <!-- Add Store -->
    <dialog-pop
      ref="dailog"
      class="popup_width"
      :title= "$t('audit.workFlows.addCC')"
      :close-on-click-modal="false"
      :show-close="false"
      :dialogWidth = "add_width"
      :visible="showingAddStore"
      @cancelHandler="hideAddStoreDialog('showingAddStore')"
      @confirmHandler="confirmAddStoreDialog"
    >
      <div class="dialog-slot">
        <div class="dialog-content">
          <div class="showing_search_user">
            <div class="filter_section">
                <!-- 關鍵字 -->
                <div class="flex-row" style="margin-right: 3%; margin-bottom: 10px;">
                  <div class="title-name">{{$t('audit.workFlows.keywords')}}</div>
                  <div class="title-status"> 
                    <el-input
                      :placeholder="$t('audit.workFlows.searchNameMail')"
                      style="width: 200px"
                      clearable
                      />
                  </div>
                </div>
                <!-- 區域二 -->
                <div class="flex-row" style="margin-right: 3%; margin-bottom: 10px;">
                  <div class="title-name"> 區域一</div>
                  <div class="title-status"> 
                    <el-select
                      :placeholder="$t('audit.workFlows.depart')"
                      style="width: 180px"
                      >
                      <el-option
                        v-for="(item, index) in templateList"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
                <!-- 區域二 -->
                <div class="flex-row" style="margin-right: 3%; margin-bottom: 10px;">
                  <div class="title-name">區域二</div>
                  <div class="title-status"> 
                    <el-select
                      :placeholder="$t('audit.workFlows.position')"
                      style="width: 180px"
                      >
                      <el-option
                        v-for="(item, index) in templateList"
                        :key="index"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </div>
                </div>
            </div>
            <div class="is_select">
              <div class="title-name"> 選擇門店 </div>
              <div class="user_selected">
                <el-tag
                  v-for="(t, index) in tags"
                  :key="index"
                  closable
                  :type="t.type"
                  @close="handleClose(tag)">
                  {{t.userName}}
                </el-tag>
              </div>
            </div>
            <div class="users">
              <table-only
                ref="usersList"
                class="table-white"
                :column-data ="userColumnData"
                :table-data ="searchUserData"
                :showSelectionColumn = showSelectionColumn
                
                :highlight-current-row = "false"
                :is-loading-data ="isLoadingData"
                :allowRowExpand = "false"
                :showBorder = "false"
                :headerStyle ="{height:'47px',backgroundColor: '#fff',border:'none',fontSize:'12px',paddingLeft: '12px',}" 
                :cellStyle ="{backgroundColor: '#fff !important'}"
                @handleSelectionChange = "handleSelectionChange "
              />
            </div>
          
          </div>
        </div>
      </div>
    </dialog-pop>

    <!-- Edit Store -->
    <dialog-pop
      ref="dailog"
      title= "編輯所選門店"
      :close-on-click-modal="false"
      :show-close="false"
      :visible="showingEditStore"
      @cancelHandler="hideAddStoreDialog('showingEditStore')"
      @confirmHandler="confirmAddStoreDialog"
    >
      <div class="dialog-slot">
        <div class="dialog-content">

          <div class="memo_setting">
            <!-- 提醒日期 -->
            <div class="remider_setting flex-column">
              
              <p style="font-size: 14px; font-weight: 900"><span style="color: #f31d65">*</span> 提醒日期</p>
              <el-date-picker
                v-model="value1"
                type="date"
                placeholder="提醒日期">
              </el-date-picker>
            </div>
            <!-- 提醒時間 -->
            <div class="remider_setting flex-column">
              <p style="font-size: 14px; font-weight: 900"><span style="color: #f31d65">*</span>提醒時間</p>
              <el-time-select
                v-model="value2"
                :picker-options="{
                  start: '00:00',
                  step: '01:00',
                  end: '23:00'
                }"
                placeholder="提醒時間">
              </el-time-select>
            </div>
          </div>
          <div class="memo_setting ">
            <!-- 提醒方式 -->
            <div class="remider_setting flex-column">
              <p style="font-size: 14px; font-weight: 900"><span style="color: #f31d65">*</span>提醒方式</p>
              <el-select
                v-model="value3"
                multiple
                filterable
                :loading="loading" 
                style="width:300px">
                <el-option
                  v-for= "(item, index) in remiderStyle"
                  :key="index"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="memo_setting">
            <!-- 已選門店總數 -->
            <div class="remider_setting flex-column">
              <p style="font-size: 14px; font-weight: 900">已選門店總數：10</p>
              <div class="selected_stores flex-column">
                <div class="store_name">研華林口店</div>
                <div class="store_name">研華林口店</div>
                <div class="store_name">研華林口店</div>
                <div class="store_name">研華林口店</div>
                <div class="store_name">研華林口店</div>
                <div class="store_name">研華林口店</div>
            
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog-pop>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import {scheduleRESTful} from '@/api/index';
import DateTimeSelector from '@/components/DateTimeSelector';
import DelayButton from '@/components/DelayButton';
import SettingTable from '@/components/SettingTable';
import DialogPop from '@/components/DialogPop';
import TableOnly from '@/components/TableOnly';
import util from '@/common/util';

export default{
  name: 'PersonalSchedule',
  components: {
    DateTimeSelector,
    DelayButton,
    SettingTable,
    TableOnly,
    DialogPop
  },
  data(){
    return {
      
      tempboolean_1: true,
      tempboolean_2: true,
      value1: '',
      value2: '',
      value3: '',
      remiderStyle:['當下','前一日','前1小時'],
      templateList:['aaa','bbb','ccc'],
      tags: [
        {
          userName: "阿信小障",
          type: "info"
        },
        {
          userName: "阿信",
          type: "info"
        },
        {
          userName: "飄髮哥",
          type: "info"
        },
        {
          userName: "Albert",
          type: "info"
        },
      ],
      searchUserData:[
        {
          "section1": "台北市",
          "section2": "信義區",
          "store": "研華林口店",
          "timeZone": "+8"
        },
        {
          "section1": "新北市",
          "section2": "板橋區",
          "store": "新埔店",
          "timeZone": "+8"
        },
        {
          "section1": "桃園市",
          "section2": "桃園區",
          "store": "站前店",
          "timeZone": "+8"
        
        },
        {
          "section1": "新竹市",
          "section2": "竹北市",
          "store": "竹北科技園區店",
          "timeZone": "+8"
          
        },

      ],
      // ====== !! ======
    
      scheDuleData: false,
      emptyData: require('../../../../static/img/icon_data.svg'),

      
      // ======
      add_width: "1000",
      edit_width: "500",
      showingAddStore: false,
      showingEditStore: false,
      userColumnData: [
        {
          'prop': 'section1',
          'label': "區域一",
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'section2',
          'label': "區域二",
          'width': 110,
          'maxWidth': 110,
        },
        {
          'prop': 'store',
          'label': "門店",
          'width': 100,
          'maxWidth': 100,
        },
        {
          'prop': 'timeZone',
          'label': "門店時區",
          'width': 100,
          'maxWidth': 100,
        },
      ],
      userData:[],
      inputSearchUser: '',
      showSelectionColumn: true,

      
      inputSearchUser: '',
      titleList:[],
      titleListAry:[],
      departmentAry:[],
      curTemplateDepartment: '',
      curTemplateTitleList: '',
    // ======
    
      inputSearchValue:'',
      dateValue:[],
      tableData:[{schName:'1',tagName:'test',incepNum:3,startDate:'2023/01/01',endDate:'2023/01/02'}],
      scheduleList:[],
      columnOperationData:{
        label: this.$t('titleView.operation'),
        minWidth: '50',
        align: 'left',
        operation: [
            {
              lable: '',
              icon: 'icon-copy',
              methods: 'copy'
            },
            {
              lable: '',
              icon: 'icon-setting',
              methods: 'set'
            }
        ]
      },
      loading: false,
      isLoadingData: false,
      total:0,
      curPage:1,
      curSizeNum:10,
      defaultSort:{prop: 'startDate', order: 'descending'},
      inspectionStyle: ['現場巡檢','遠端巡檢'],
      
    }
  },
  computed: {
    ...mapGetters({ accountChanged: 'accountChanged' })
  },
  created() {
    this.getPersonScheduleData()
  },

  methods: {
    confirmAddStoreDialog(){

    },
    hideAddStoreDialog(key){
      this[key] = false;
    },

      // 刪除 tag
    handleClose(tag){
      console.log('tag--->', tag)
    },

    getPersonScheduleData(){
      var param = {
            taskGroupUuid: "task_group_1675153721"
        }
      scheduleRESTful.getPersonScheduleData(param).then(res =>{
          if(res.errCode == 0){
            console.log('res =========>> ', res);
          }
        }
      )
    },

  }
}
</script>

<style scoped lang="sass">
  .flex-row
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: center
  .flex-column
    display: flex
    flex-direction: column
    justify-content: flex-start
    align-items: flex-start

  .mb-10
    margin-bottom: 10px


  .title-name
      margin-right: 16px
  .red_border
    background-color: #fff
    border-color: #c60957
    color: #c60957
    font-size: 15px
    font-weight: 500
    padding: 8px 16px 7px
    transiiton: all .3s
    &:hover
      background: #c60957
      color: #FFF

  .blue_border
    background-color: #fff
    border-color: #006ab7
    color: #006ab7
    font-size: 15px
    font-weight: 500
    padding: 8px 16px 7px
    transiiton: all .3s
    &:hover
      background: #006ab7
      color: #FFF

  .schedule_setting
    width: 100%
    .search-bar
      display: flex
      flex-direction: row
      margin: 0px 0 20px 0px
      height: calc(36/1920*100vw)
      align-items: center
      font-size: calc(16/1920*100vw)
      .keyword-area
        display: flex
        flex-direction: row
        margin-left: calc(32/1980*100vw)
        align-items: center
        .search-label
          min-width: 45px
          text-align: left
          align-self: center
          font-family: NotoSansCJKTC
          font-size: calc(15/1920*100vw)
          font-weight: normal
          word-break: keep-all
          padding-right: 16px
      .scheduleLlist-area
        background-color: #FFF
        border-radius: 5px
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15)
        padding: 20px 26px 48px 24px
  .setting-titles
    border-bottom: 1px solid #e3e9f4 

  .empty_data
    height: 50vh
    display: flex
    flex-direction: column
    justify-content: center
    align-items: center

  .inspect-basic
    padding: 20px 25px

    .setting-config
      padding-left: 0
    .store_list
      width: 100%
      margin-bottom: 30px
      .task_list
        width: calc(100% - 28px)
        padding: 20px
        border-radius: 5px
        border: solid 1px #f5f5f5
        background: #f7f9fa
        margin-left: 28px
        .task_list_store
          margin-bottom: 10px
  .memo_setting
    display: flex
    flex-direction: row
    justify-content: flex-start
    align-items: flex-start
    margin-bottom: 20px
    p 
      font-size: 12px
      margin: 5px
    .remider_setting
      width: 100%
      margin-right: 20px
      .clear_all
        margin-top: 33px
        color: #006ab7
        cursor: pointer
  .selected_stores
    background: #FFF
    width: 100%
    height: 200px
    padding: 0 20px
    border-radius: 4px
    border: solid 1px #c3c4c5
    overflow: auto
    .store_name
      text-align: left
      width: 100%
      line-height: 35px
      // border-bottom: 1px solid #928

    
            
  // dialog
  .dialog-content
    width: 100%
    .showing_search_user
      width: 100%
      height: 500px
      
      .filter_section
        background: #FFF
        display: flex
        flex-wrap: wrap
        flex-direction: row
        justify-content: flex-start
        align-items: center
        padding: 10px 0 0 20px
        margin-bottom: 10px
        .summit_filter
          width: 90px
          height: 37px
          border-radius: 3px
          background: rgb(85, 102, 121)
          color: #FFF
          display: flex
          flex-direction: row
          justify-content: center
          align-items: center
          margin-bottom: 10px
          margin-left: 20px
          cursor: pointer
          transition: all .3s
          &:hover
            background: rgb(60, 92, 121)
      .is_select
        width: 100% !important
        padding: 10px 0 5px 0
        background: #FFF
        margin-bottom: 10px
        display: flex
        flex-direction: row
        justify-content: flex-start
        align-items: center
        width: fit-content
        .title-name
          width: 90px
        .user_selected
          display: flex
          flex-wrap: wrap
          flex-direction: row
          justify-content: flex-start
          .el-tag
            margin-right: 5px 
            margin-bottom: 5px

      .users
        height: 335px
        overflow: auto
        border-radius: 5px
</style>
<style lang="sass">
  .popup_width
    .el-dialog
      width: 60% !important
      background: #f7f9fa
      .el-table th
        &:first-child
          .cell
            width: 50px
            margin-left: -28px
            
</style>



<!-- <style scoped lang="scss">
.ScheduleContainer{
    width:100%;
    .search-bar{
        display:flex;
        flex-direction:row;
        margin: 0px 0 20px 0px;
        height:calc(36/1920*100vw);
        align-items: center;
        font-size:calc(16/1920*100vw);
        .keyword-area{
            display: flex;
            flex-direction: row;
            margin-left: calc(32/1980*100vw);
            align-items: center;
            .search-label{
                min-width: 45px;
                text-align: left;
                align-self: center;
                font-family: NotoSansCJKTC;
                font-size: calc(15/1920*100vw);
                font-weight: normal;
                word-break: keep-all;
                padding-right: 16px;


            }
        }
        .search-button{
            margin-left:35px;
            width: 102px;
            height: calc(36/1920*100vw);
            // background-color: #556679;
            // border-color: #556679;
            color:#fff;
            font-size: calc(15/1920*100vw);
        }
    }
    .scheduleLlist-area{
        background-color: #FFF;
        border-radius: 5px;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.15);
        padding: 20px 26px 48px 24px;
        .buttons{
            height: 40px;
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: end;
            align-items: center;
        }
        .tbl-schedule{
            border: none;
            margin-top: 20px;
            /deep/ .el-table__header-wrapper .el-table-column--selection{
                padding-left: 0px !important;
                font-size: 14px !important;
            }
            /deep/.el-table__header-wrapper
            .el-table-column--selection
            .el-checkbox__inner
            {
                border-radius: 1px;
                border: none;
                background-color: #fff;
                &:hover{
                    border-color: #dcdfe6 !important;
                }
            }
            /deep/ .el-table__header-wrapper .el-checkbox{
                display:block;
                .el-checkbox__input.is-indeterminate .el-checkbox__inner{
                    background-color: #2c90d9;
                    border-color: #2c90d9;
                    color:#FFF;
                }
                .el-checkbox__input.is-checked .el-checkbox__inner {
                    color: #1375bc;
                    font-weight: 400;
                    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
                    background-position: center right 0px;
                    border: none;
                }
                .el-checkbox__input.is-focus .el-checkbox__inner {
                border-color: #2c90d9;
                }
                .el-checkbox__inner:hover {
                border-color: #2c90d9;
                }
            }
            /deep/.el-table__body-wrapper .el-checkbox{
                border: none;
                .el-checkbox__input.is-checked .el-checkbox__inner {
                    color: #1375bc;
                    font-weight: 400;
                    background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
                    background-position: center right 20px;
                    border: none;
                }
            }
            /deep/ .el-table__body-wrapper::-webkit-scrollbar {
                width: 4px; /*滚动条宽度*/
                height: 150px; /*滚动条高度*/
            }
            /*定义滚动条轨道 内阴影+圆角*/
            /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
                /*box-shadow: 0px 1px 3px #071e4a inset; 滚动条的背景区域的内阴影*/
                border-radius: 10px; /*滚动条的背景区域的圆角*/
                background-color: #FFF; /*滚动条的背景颜色*/
            }
            /*定义滑块 内阴影+圆角*/
            /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
                box-shadow: 0px 1px 3px #acaeb1 inset; /*滚动条的内阴影*/
                border-radius: 2px; /*滚动条的圆角*/
                background-color: #acaeb1; /*滚动条的背景颜色*/
            }
        }
    }
    /deep/
    .el-table{
        border:none;
        box-shadow: none;
    }
    /deep/
      .el-table th .cell{
      padding-left: 0px !important;
    }
    /deep/
    .el-table
    .el-table__body-wrapper
    .el-table-column--selection
    .el-checkbox__inner
    {
      border-radius: 1px;
      border: solid 1px #acaeb1;
      background-color: #fff;
    }
    /deep/
    .el-table
    .el-table__body-wrapper
    .el-table-column--selection
    .is-checked
    .el-checkbox__inner
    {
      /*border-radius: 1px;
      border: solid 1px #2c90d9;
      background-color: #e0f2ff;
      color:#2c90d9;
      &::after{
       border-color:#2c90d9;
      }*/
        color: #1375bc;
        font-weight: 400;
        background: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij4NCiAgICA8cGF0aCBzdHlsZT0iZmlsbDpub25lIiBkPSJNMCAwaDE2djE2SDB6Ii8+DQogICAgPHBhdGggZD0ibS40IDMgMyA0IDYtNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMy4xIDQuNSkiIHN0eWxlPSJzdHJva2U6IzJjOTBkOTtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLXdpZHRoOjEuNXB4O2ZpbGw6bm9uZSIvPg0KPC9zdmc+DQo=) no-repeat;
        background-position: center right 0px;
        border: none;
    }
}
</style> -->
