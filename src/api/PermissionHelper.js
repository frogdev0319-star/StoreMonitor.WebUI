import { Uint64BE } from 'int64-buffer';

export default class PermissionHelper {
  /**
   * index(0) => ID(1): Overview
   * index(1) => ID(2): Inspection
   * index(2) => ID(4): Event
   * index(3) => ID(8): Statistics
   * index(4) => ID(16): Settings
   * index(5) => ID(16): Video/Message
   * index(6) => ID(16): Audit
   */
  static data = [];

  static setData(data) {
    (data.length > 0) && (this.data = data);
  }

  static enableAuthorities(index, bigEndian, littleEndian) {
    if (this.data.length === 0) {
      return true;
    }
    if (index == 6 && this.data.length < 7) {
      this.data[index] = 274877906944;//全不勾,全勾:274877906951
    }

    // console.log('bigEndian', bigEndian)
    // console.log('littleEndian', littleEndian)
    const authority = new Uint64BE(this.data[index].toString()).toString(10);
    const base = new Uint64BE(bigEndian, littleEndian).toString(10);
    // console.log('authority', authority)
    // console.log('base', base)
    return authority & base;
  }

  // index(0) => ID(1): Overview
  static enableRemoteOverview() {
    return this.enableAuthorities(0, 0x0, 0x1);
  }

  static enableEventOverview() {
    return this.enableAuthorities(0, 0x0, 0x2);
  }



  // index(1) => ID(2): Inspection
  static enableRemoteInspect() {
    return this.enableAuthorities(1, 0x0, 0x1);
  }
  static enableLocalInspect() {
    return this.enableAuthorities(1, 0x0, 0x2);
  }
  static enableInspectReport() {
    return this.enableAuthorities(1, 0x0, 0x4);
  }
  static enablePatrolTask() {
    return this.enableAuthorities(1, 0x0, 0x8);
  }
  static enableStoreMonitor() {
    return this.enableAuthorities(1, 0x0, 0x10);
  }
  static enableTransactionPatrol() {
    return this.enableAuthorities(1, 0x0, 0x20);
  }
  static enableStorePointCheck() {
    return this.enableAuthorities(1, 0x0, 0x40);
  }
  static enableCustomers() {
    return this.enableAuthorities(1, 0x0, 0x80);
  }
  static enableWebPatrol() {
    return this.enableAuthorities(1, 0x0, 0x100);
  }



  // index(2) => ID(4): Event
  static enableEventHandle() {
    return this.enableAuthorities(2, 0x0, 0x1);
  }

  static enableEventClose() {
    return this.enableAuthorities(2, 0x0, 0x2);
  }

  static enableEventAdd() {
    return this.enableAuthorities(2, 0x0, 0x4);
  }
  static enableEventReturn() {
    return this.enableAuthorities(2, 0x0, 0x8);
  }

  // index(3) => ID(8): Statistics
  static enablePatrolEvaStatistics() {
    return this.enableAuthorities(3, 0x0, 0x1);
  }

  static enableInspectStatistics() {
    return this.enableAuthorities(3, 0x0, 0x2);
  }

  static enableEventStatistics() {
    return this.enableAuthorities(3, 0x0, 0x4);
  }

  static enableSupervisionEffStatistics() {
    return this.enableAuthorities(3, 0x0, 0x8);
  }

  /*static enableCheckinStatistics() {
    return this.enableAuthorities(3, 0x0, 0x10);
  }*/
  static enableSingleStoreStatStatistics() {
    return this.enableAuthorities(3, 0x0, 0x10);
  }
  static enableAppraisalCompareStatistics() {
    return this.enableAuthorities(3, 0x0, 0x20);
  }
  static enableStatistics() {
    return this.enableAuthorities(3, 0x8, 0x0);
  }

  // ===== index(4) => ID(16): Settings =====
  // static enablePatrolSetting() {
  //   return this.enableAuthorities(4, 0x0, 0x1);
  // }
  // static enableDeviceSetting() {
  //   return this.enableAuthorities(4, 0x0, 0x2);
  // }

  // static enableGeneralSetting() {
  //   return this.enableAuthorities(4, 0x0, 0x2);
  // }

  // static enableStoreSetting() {
  //   return this.enableAuthorities(4, 0x0, 0x4);
  // }

  // static enableScheduleSetting() {
  //   return this.enableAuthorities(4, 0x0, 0x8);
  // }

  // static enableTitleSetting() {
  //   return this.enableAuthorities(4, 0x0, 0x10);
  // }

  // static enableReportSetting() {
  //   return this.enableAuthorities(4, 0x0, 0x20);
  // }
  // static enableWorkflowSetting() {
  //   return this.enableAuthorities(4, 0x0, 0x40);
  // }



  // index(4) => ID(16): Settings
  static enableDeviceSetting() {
    return this.enableAuthorities(4, 0x0, 0x1);
  }
  static enableGeneralSetting() {
    return this.enableAuthorities(4, 0x0, 0x2);
  }
  static enablePatrolSetting() {
    return this.enableAuthorities(4, 0x0, 0x4);
  }
  static enableStoreSetting() {
    return this.enableAuthorities(4, 0x0, 0x8);
  }
  static enableScheduleSetting() {
    return this.enableAuthorities(4, 0x0, 0x10);
  }

  static enableReportSetting() {
    return this.enableAuthorities(4, 0x0, 0x20);
  }
  static enableWorkflowSetting() {
    return this.enableAuthorities(4, 0x0, 0x40);
  }

  static enableTitleSetting() {
    return this.enableAuthorities(4, 0x0, 0x80);
  }



  // index(5) => ID(32): Video/Message
  static enableVideo() {
    return this.enableAuthorities(5, 0x0, 0x1);
  }
  static enableMessage() {
    return this.enableAuthorities(5, 0x0, 0x2);
  }
  static getInterget() {
    const big = new Uint64BE(0x1, 0x1);
  }

  //index(6) => 簽核流程
  static enableSendAudit() {
    return this.enableAuthorities(6, 0x0, 0x01);
  }
  static enableWaitAudit() {
    return this.enableAuthorities(6, 0x0, 0x02);
  }
  static enableTranscriptNotify() {
    return this.enableAuthorities(6, 0x0, 0x04);
  }

  //index(7) => 巡檢排程
  static enableScheduleSetting2() {
    return this.enableAuthorities(7, 0x0, 0x01);
  }
  static enableScheduleHistroy() {
    return this.enableAuthorities(7, 0x0, 0x02);
  }

  static enableScheduleExecuted() {
    return this.enableAuthorities(7, 0x0, 0x04);
  }





  //秘密客權限
  static enableMimicMode = false;
  static setShowMimicMode(val) {
    console.log("setShowMimicMode:", val);
    this.enableMimicMode = val;
  }

  //進階設定



  static advancedMode = false;
  static setAdvancedModeMode(val) {
    console.log("advancedMode:", val);
    this.advancedMode = val;
  }



}
