import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/radar';
import 'echarts/lib/chart/scatter';
import 'echarts/lib/chart/effectScatter';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/polar';
import 'echarts/lib/component/geo';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/title';
import 'echarts/lib/component/visualMap';
import 'echarts/lib/component/dataset';
import 'echarts/map/js/world';
import 'zrender/lib/svg/svg';

export default {
  data() {
    return {
      sidebarElm: null
    };
  },

  mounted() {
    this.initListener();
  },

  beforeDestroy() {
    this.destroyListener();
  },

  methods: {
    sidebarResizeHandler(e) {
      this.adjustChart();
      
    },

    initListener() {
      console.log('resize ~~~~~~~~>> GO');
      window.addEventListener('resize', this.adjustChart, false);
      this.sidebarElm = document.getElementsByClassName('aside-menu')[0];
      this.sidebarElm && this.sidebarElm.addEventListener('transitionend', this.sidebarResizeHandler, false);
    },

    destroyListener() {
      window.removeEventListener('resize', this.adjustChart);
      this.adjustChart = null;
      this.sidebarElm && this.sidebarElm.removeEventListener('transitionend', this.sidebarResizeHandler, false);
    }
  }
};
