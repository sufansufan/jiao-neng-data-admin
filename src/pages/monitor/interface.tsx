/* eslint-disable react/no-danger */
/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect, memo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Line } from '@ant-design/charts';
import { Radio } from 'antd';
import Table from '@/components/Table';
import { findInterfaceHistory, findInterfaceLog, findInterfaceTopLog } from '@/services/monitor';

const List: React.FC<{}> = () => {
  const [historyData, setHistoryData] = useState([]);
  const [range, setRange] = useState('');
  const [interfaceLog, setInterfaceLog] = useState({
    total: 0,
    list: [],
  });
  const [log, setLog] = useState({
    total: 0,
    list: [],
  });

  const getHistory = () => {
    findInterfaceHistory({ range }).then((res: any) => {
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

  const getInterfaceLog = (params: any = {}) => {
    findInterfaceLog({ ...params, page: params.page || 1, limit: 10 }).then((res: any) => {
      const { total_count, logs } = res;
      setInterfaceLog({
        list: logs,
        total: total_count,
      });
    });
  };

  const getInterfaceTopLog = (params: any = {}) => {
    findInterfaceTopLog({ ...params, page: params.page || 1, limit: 10 }).then((res: any) => {
      const { total_count, items } = res;
      setLog({
        list: items,
        total: total_count,
      });
    });
  };

  useEffect(() => {
    getInterfaceLog();
    getInterfaceTopLog();
  }, []);

  useEffect(() => {
    getHistory();
  }, [range]);

  const columns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '来源',
      dataIndex: 'source',
      align: 'center',
    },
  ];

  const rightColumns = [
    {
      title: '接口名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '调用次数',
      dataIndex: 'count',
      align: 'center',
    },
  ];

  const config = {
    title: {
      visible: true,
      text: '接口调用',
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
            title="接口调用日志"
            columns={columns}
            data={interfaceLog.list}
            total={interfaceLog.total}
            onChange={(params: object) => getInterfaceLog(params)}
          />
        </div>
        <div style={{ width: 'calc(50% - 10px)' }}>
          <Table
            title="接口调用频率日志"
            columns={rightColumns}
            data={log.list}
            total={log.total}
            onChange={(params: object) => getInterfaceTopLog(params)}
          />
        </div>
      </div>
    </PageHeaderWrapper>
  );
};

export default memo(List);
