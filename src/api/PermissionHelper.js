import { Uint64BE } from 'int64-buffer';

export default class PermissionHelper {
  /**
   * index(0) => ID(1): Overview
   * index(1) => ID(2): Inspection
   * index(2) => ID(4): Event
   * index(3) => ID(8): Statistics
   * index(4) => ID(16): Settings
   * index(5) => ID(16): Video/Message
   */
  static data = [];

  static setData(data) {
    console.log(data);
    (data.length > 0) && (this.data = data);
  }

  static enableAuthorities(index, bigEndian, littleEndian) {
    if (this.data.length === 0) {
      return true;
    }

    const authority = new Uint64BE(this.data[index].toString()).toString(10);
    const base = new Uint64BE(bigEndian, littleEndian).toString(10);

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

  static enableStatistics() {
    return this.enableAuthorities(3, 0x8, 0x0);
  }

  // index(4) => ID(16): Settings
  static enablePatrolSetting() {
    return this.enableAuthorities(4, 0x0, 0x1);
  }
  static enableDeviceSetting() {
    return this.enableAuthorities(4, 0x0, 0x2);
  }

  static enableStoreSetting() {
    return this.enableAuthorities(4, 0x0, 0x4);
  }

  static enableScheduleSetting() {
    return this.enableAuthorities(4, 0x0, 0x8);
  }

  static enableTitleSetting() {
    return this.enableAuthorities(4, 0x0, 0x10);
  }

  static enableReportSetting() {
    return this.enableAuthorities(4, 0x0, 0x20);
  }

  // index(5) => ID(32): Video/Message
  static enableVideo() {
    console.log('enableVideo' + this.enableAuthorities(5, 0x0, 0x1))
    return this.enableAuthorities(5, 0x0, 0x1);
  }
  static enableMessage() {
    console.log('enableVideo' + this.enableAuthorities(5, 0x0, 0x2))
    return this.enableAuthorities(5, 0x0, 0x2);
  }
  static getInterget() {
    const big = new Uint64BE(0x1, 0x1);
  }
}
