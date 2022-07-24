<template>
    <div class="page-container mysterio-page paper">
        <div class="mysterio-title padding flex-center">
            {{this.$t('mysterio.storeAuthSetting')}}
            <div class="spacer"></div>
            <div class="buttons">
                <delay-button
                    type="filled"
                    @click="saveAuth">
                    <div class="button-area">
                        <span>{{ $t('titleView.save') }}</span>
                    </div>
                </delay-button>
            </div>
        </div>
    </div>
</template>
<script>
import { mysteroRESTful } from '@/api/index';
import { mapGetters } from 'vuex';
import TableOnly from '@/components/TableOnly';
import TblPaginationOnly from '@/components/TblPaginationOnly';
import util from '@/common/util';
import DelayButton from '@/components/DelayButton';
import DialogPop from '@/components/DialogPop';

export default {
    name: 'MysterioSetting',
    components: {TableOnly,TblPaginationOnly,DelayButton,DialogPop },
    data() {
      return {
        allTableData:[],
        tableData: [],
        noData: this.$t('deviceView.noData'),
        isLoadingData: true,
        columnData: [
          {
            'prop': 'userName',
            'label': this.$t('mysterio.userName'),
            'width': 90,
            'maxWidth': 130,
            'isExpand': false
          },
          {
            'prop': 'email',
            'label': this.$t('mysterio.email'),
            'sortable': true,
            'width': 150,
            'maxWidth': 150,
            'isExpand': false
          },
          {
            'prop': 'position',
            'label': this.$t('mysterio.position'),
            'sortable': true,
            'width': 100,
            'maxWidth': 100,
            'isExpand': false
          },
          {
            'prop': 'storeAuth',
            'label': this.$t('mysterio.storeAuth'),
            'sortable': true,
            'width': 30,
            'maxWidth': 30,
            'isExpand': false
          },
          {
            'prop': 'updateTs',
            'label': this.$t('mysterio.lastUpdateTime'),
            'sortable': true,
            'width': 130,
            'maxWidth': 130,
            'isExpand': false
          }
        ],
        columnOperationData: {
          label: this.$t('titleView.operation'),
          minWidth: '50',
          align: 'left',
          operation: [
            {
                lable: '',
                icon: 'icon-setting',
                methods: 'set'
            }
          ]
        },
        headerStyle: 'table-header',
        total:0,
        page:1,
        sizeNum:10,
        white:'',
      };
    },

    computed: {
      ...mapGetters({ accountChanged: 'accountChanged' })
    },

    watch: {
      accountChanged(val) {
        val !== 0 && this.getMysterioList();
      }
    },

    created() {
      this.getMysterioList();
    },

    methods: {
        getMysterioList(){
            console.log("getMysterioList");
        },
        saveAuth(){}
    }
}
</script>

<style scoped lang="scss">
.mysterio-page{
    height: 100%;
    position: relative;
    font-size: calc(18/1920*100vw);
    box-sizing: border-box;
    .mysterio-title{
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e3e9f4;
  }
}
</style>