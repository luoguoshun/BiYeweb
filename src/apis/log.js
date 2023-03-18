import axios from '@/utils/axios';
export default {
  //获取系统日志列表
  getLogList(page, row, conditions, level, publicationDates) {
    return axios.post('/api/Background/Log/GetLogList', {
      Page: page,
      Row: row,
      Conditions: conditions,
      Level: level,
      PublicationDates: publicationDates,
    });
  },
  //获取系统日志类型列表
  getLogTypeList() {
    return axios.post('/api/Background/Log/GetLogTypeList');
  },
  //删除系统日志
  deleteLogs(logIds) {
    return axios.post('/api/Background/Log/DeleteLogs', logIds);
  },
  //导出系统日志
  exportLogs(logIds) {
    return axios.post('/api/Background/Log/ExportLogs', {
      logIds
    });
  },
  //获取操作日志列表
  getOperateLogList(page, row, conditions, type, publicationDates) {
    return axios.post('/api/Background/Log/GetOperateLogList', {
      Page: page,
      Row: row,
      Conditions: conditions,
      Type: type,
      PublicationDates: publicationDates,
    });
  },
  //导出系统操作日志
  exportOperateRecords(operateIds) {
    return axios.post('/api/Background/Log/ExportOperateRecords', operateIds);
  },
  //删除系统操作日志
  deleteOperateRecords(operateIds) {
    return axios.post('/api/Background/Log/DeleteOperateRecords', operateIds);
  },
};