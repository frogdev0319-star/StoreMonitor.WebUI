import PouchDB from 'pouchdb';

export default class Database {
  static getDBInfo() {
    return new Promise((resolve, reject) => {
      this.DataBase.info().then((info) => {
        resolve(info);
      }).catch(err => {
        reject(err);
      });
    });
  }

  static destoryDB() {
    return new Promise((resolve, reject) => {
      this.DataBase.destroy().then(() => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  static addDataToDB(userId, text) {
    return new Promise((resolve, reject) => {
      this.updateData(userId, text).then(res => {
        resolve();
      }).catch(err => {
        reject(err);
      });
    });
  }

  static getDataFromDB(userId) {
    return new Promise((resolve, reject) => {
      this.DataBase.get(userId).then(doc => {
        resolve(doc);
      }).catch(err => {
        reject(err);
      });
    });
  }

  static updateData(userId, text) {
    let hasDataFlag = true;
    return new Promise((resolve, reject) => {
      this.DataBase.get(userId).catch(err => {
        if (err.name === 'not_found') {
          console.log('err');
          hasDataFlag = true;
          return hasDataFlag;
        } else {
          hasDataFlag = false;
          throw err;
        }
      }).then((hasDataFlag) => {
        console.log(hasDataFlag);
        if (hasDataFlag === true) {
          console.log('update');
          return this.DataBase.put(text);
        } else if (hasDataFlag.data) {
          hasDataFlag.data = text.data;
          hasDataFlag.rule = text.rule;
          return this.DataBase.put(hasDataFlag);
        }
      }).then(() => {
        resolve();
      })
        .catch(err => {
          reject(err);
        });
    });
  }
}

Database.DataBase = new PouchDB('storevue_database');

