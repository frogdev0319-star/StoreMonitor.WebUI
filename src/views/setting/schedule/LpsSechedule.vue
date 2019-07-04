<template>
  <div>
    <div v-for="(item, index) in selectedMonth">
      <el-select v-model="item.month" clearable  placeholder="选择月份" size="mini">
        <el-option v-for="_item in selfMonthList" :key="_item.value"
                   :label="_item.name"
                   :value="_item.value">
        </el-option>
      </el-select>
      <el-select v-model="item.days" clearable  placeholder="选择日期" size="mini" multiple >
        <el-option v-for="items in selfDaysList" :key="items.value"
                   :label="items.name"
                   :value="items.value">
          <el-checkbox v-model="items.checked" @change="checkItem(index)">{{items.name}}</el-checkbox>
        </el-option>
      </el-select>
    </div>

  </div>
</template>

<script>
    export default {
        name: "onsitePatrolSch",
        data(){
          return{
            selectedMonth:[
              {
                month: 1,
                days: [2,3]
              },
              {
                month: 4,
                days: [7,9]
              },
            ],
            monthDaysArray: [],
            selfMonthList: [
              {
                'checked': false,
                'name': '1',
                'value': '1',
              },
              {
                'checked': false,
                'name': '2',
                'value': '2',
              },
              {
                'checked': false,
                'name': '3',
                'value': '3',
              },
              {
                'checked': false,
                'name': '4',
                'value': '4',
              },
              {
                'checked': false,
                'name': '5',
                'value': '5',
              },
              {
                'checked': false,
                'name': '6',
                'value': '6',
              },
              {
                'checked': false,
                'name': '7',
                'value': '7',
              },
              {
                'checked': false,
                'name': '8',
                'value': '8',
              },
              {
                'checked': false,
                'name': '9',
                'value': '9',
              },
              {
                'checked': false,
                'name': '10',
                'value': '10',
              },
              {
                'checked': false,
                'name': '11',
                'value': '11',
              },
              {
                'checked': false,
                'name': '12',
                'value': '12',
              },
            ],
            selfDays: [],
            selfMonth: '',
            selfDaysList: [
              {
                'checked': false,
                value: 1,
                name: '1号'
              },
              {
                'checked': false,
                value: 2,
                name: '2号'
              },
              {
                'checked': false,
                value: 3,
                name: '3号'
              },
              {
                'checked': false,
                value: 4,
                name: '4号'
              },
              {
                'checked': false,
                value: 5,
                name: '5号'
              },
              {
                'checked': false,
                value: 6,
                name: '6号'
              },
              {
                'checked': false,
                value: 7,
                name: '7号'
              },
              {
                'checked': false,
                value: 8,
                name: '8号'
              },
              {
                'checked': false,
                value: 9,
                name: '9号'
              },
              {
                'checked': false,
                value: 10,
                name: '10号'
              },
              {
                'checked': false,
                value: 11,
                name: '11号'
              },
              {
                'checked': false,
                value: 12,
                name: '12号'
              },
              {
                'checked': false,
                value: 13,
                name: '13号'
              },
              {
                'checked': false,
                value: 14,
                name: '14号'
              },
              {
                'checked': false,
                value: 15,
                name: '15号'
              },
              {
                'checked': false,
                value: 16,
                name: '16号'
              },
              {
                'checked': false,
                value: 17,
                name: '17号'
              },
              {
                'checked': false,
                value: 18,
                name: '18号'
              },
              {
                'checked': false,
                value: 19,
                name: '19号'
              },
              {
                'checked': false,
                value: 20,
                name: '20号'
              },
              {
                'checked': false,
                value: 21,
                name: '21号'
              },
              {
                'checked': false,
                value: 22,
                name: '22号'
              },
              {
                'checked': false,
                value: 23,
                name: '23号'
              },
              {
                'checked': false,
                value: 24,
                name: '24号'
              },
              {
                'checked': false,
                value: 25,
                name: '25号'
              },
              {
                'checked': false,
                value: 26,
                name: '26号'
              },
              {
                'checked': false,
                value: 27,
                name: '27号'
              },
              {
                'checked': false,
                value: 28,
                name: '28号'
              },
              {
                'checked': false,
                value: 29,
                name: '29号'
              },
              {
                'checked': false,
                value: 30,
                name: '30号'
              },
              {
                'checked': false,
                value: 31,
                name: '31号'
              },
            ]
          }
        },
        created:function () {

        },
        methods:{
          checkItem(index){
            console.log(index)
            this.selfDaysList.forEach(item=>{

            })
          }
        }
    }
</script>

<style scoped>

</style>
