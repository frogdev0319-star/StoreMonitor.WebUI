<template>
  <div class="content">
    <div style="
    width: 190px;
    padding: 0 10px;
    position: absolute; 
    overflow:hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    ">{{selectedStr}}</div>
    <el-select
      v-model="selected"
      multiple
      v-bind="$attrsAll"
      v-on="$listenserAll"
      @change="onChange"
      class="storevue-multi_select shadow-light"
    >
      <el-option
        v-for="item in mdoptionsList"
        :key="item.key"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  name: "MultiSelector",
  props: {
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    options: {
      type: Array,
      default: () => {
        return [];
      },
    }
  },
  data() {
    const selected = this.value || [];
    return {
      selected,
      mdoptionsValue: [],
      oldMdoptionsValue: [],
      mdoptionsList: [],
      selectedStr: ''
    };
  },
  computed: {
    $attrsAll() {
      // const val = this.$vnode.data.model && this.$vnode.data.model.value;
      const result = {
        // value: val,
        ...this.$attrs,
      };
      return result;
    },
    $listenserAll() {
      const _this = this;
      return Object.assign({}, this.$listeners, {
        change: () => {
          this.$emit(
            "change",
            (_this.selected || []).filter((v) => v !== "all")
          );
        },
        input: () => {
          this.$emit(
            "input",
            (_this.selected || []).filter((v) => v !== "all")
          );
        },
      });
    },
  },
  watch: {
    selected: {
      immediate: true,
      deep: true,
      handler(val) {
        const self = this;
        let options_ = [...this.options]
        this.$emit("input",(val || []).filter((v) => v !== "all"));
        this.selectedStr = options_
        .filter(option => (val || []).includes(option.id))
        .map(op => op.name)
        .join(',')
      },
    },
    options: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val || val.length === 0) {
          this.mdoptionsList = [];
        } else {
          this.mdoptionsList = [
            {
              key: "all",
              id: "all",
              name: "全部",
            },
            ...val,
          ];
        }
      },
    },
  },
  mounted() {},
  methods: {
    onChange(val) {
      // eslint-disable-next-line no-debugger
      const allValues = [];
      // 保留所有值
      for (const item of this.mdoptionsList) {
        allValues.push(item.id);
      }
      // 用来储存上一次的值，可以进行对比
      const oldVal =
        this.oldMdoptionsValue.length === 1
          ? []
          : this.oldMdoptionsValue[1] || [];
      // 若是全部选择
      if (val.includes("all")) this.selected = allValues;
      // 取消全部选中  上次有 当前没有 表示取消全选
      if (oldVal.includes("all") && !val.includes("all")) this.selected = [];
      // 点击非全部选中  需要排除全部选中 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes("all") && val.includes("all")) {
        const index = val.indexOf("all");
        val.splice(index, 1); // 排除全选选项
        this.selected = val;
      }
      // 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes("all") && !val.includes("all")) {
        if (val.length === allValues.length - 1)
          this.selected = ["all"].concat(val);
      }
      // 储存当前最后的结果 作为下次的老数据
      this.oldMdoptionsValue[1] = this.selected;
    },
  },
};
</script>
<style lang="scss" scoped>
  .content {
    position: relative;
    background: #fff;
    border-radius: 3px
  }
</style>