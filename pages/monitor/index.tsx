/* eslint-disable react/no-danger */
/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect, memo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Line } from '@ant-design/charts';
import { Radio } from 'antd';
import Table from '@/components/Table';
import { findHistory, findErrorLog, findLog } from '@/services/monitor';

const List: React.FC<{}> = () => {
  const [historyData, setHistoryData] = useState([]);
  const [range, setRange] = useState('');
  const [errorLog, setErrorLog] = useState({
    total: 0,
    list: [],
  });
  const [log, setLog] = useState({
    total: 0,
    list: [],
  });

  const getHistory = () => {
    findHistory({ range }).then((res: any) => {
      const { x, y } = res.data;
      const list = x.map((item: string, index: number) => {
        return {
          x: item,
          数量: y[index],
        };
      });
      setHistoryData(list);
    });
  };

  const getErrorLog = (params: any = {}) => {
    findErrorLog({ ...params, page: params.page || 1, limit: 10 }).then((res: any) => {
      const { total_count, logs } = res;
      setErrorLog({
        list: logs,
        total: total_count,
      });
    });
  };

  const getLog = (params: any = {}) => {
    findLog({ ...params, page: params.page || 1, limit: 10 }).then((res: any) => {
      const { total_count, logs } = res;
      setLog({
        list: logs,
        total: total_count,
      });
    });
  };

  useEffect(() => {
    getErrorLog();
    getLog();
  }, []);

  useEffect(() => {
    getHistory();
  }, [range]);

  const columns = [
    {
      title: '资源目录',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '公司名称',
      dataIndex: 'company_name',
      align: 'center',
    },
    {
      title: '错误原因',
      dataIndex: 'content',
      align: 'center',
    },
  ];

  const config = {
    title: {
      visible: true,
      text: '采集数量',
    },
    padding: 'auto',
    forceFit: true,
    data: historyData,
    xField: 'x',
    yField: '数量',
    label: {
      visible: true,
      type: 'point',
    },
    point: {
      visible: true,
      size: 5,
      shape: 'diamond',
      style: {
        fill: 'white',
        stroke: '#2593fc',
        lineWidth: 2,
      },
    },
  };

  const updateRange = (e: any) => {
    setRange(e.target.value);
  };

  return (
    <PageHeaderWrapper title={false}>
      <div style={{ backgroundColor: '#fff', paddingTop: '30px' }}>
        <div style={{ paddingLeft: '25px' }}>
          <Radio.Group value={range} buttonStyle="solid" onChange={updateRange}>
            <Radio.Button value="">全部</Radio.Button>
            <Radio.Button value="1H">1小时</Radio.Button>
            <Radio.Button value="1D">1天</Radio.Button>
            <Radio.Button value="7D">7天</Radio.Button>
            <Radio.Button value="1M">1个月</Radio.Button>
            <Radio.Button value="1Y">1年</Radio.Button>
          </Radio.Group>
        </div>
        <Line {...config} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <div style={{ width: 'calc(50% - 10px)' }}>
          <Table
            title="异常日志"
            columns={columns}
            data={errorLog.list}
            total={errorLog.total}
            onChange={(params: object) => getErrorLog(params)}
          />
        </div>
        <div style={{ width: 'calc(50% - 10px)' }}>
          <Table
            title="日志"
            columns={[
              {
                title: '资源目录',
                dataIndex: 'resource_name',
                align: 'center',
              },
              {
                title: '公司名称',
                dataIndex: 'company_name',
                align: 'center',
              },
              {
                title: '采集时间',
                dataIndex: 'updated_at',
                align: 'center',
              },
            ]}
            data={log.list}
            total={log.total}
            onChange={(params: object) => getLog(params)}
          />
        </div>
      </div>
    </PageHeaderWrapper>
  );
};

export default memo(List);
