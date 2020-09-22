import React, { useState } from 'react';
import { Card, Form, Table } from 'antd';

const { Item } = Form;

interface Props {
  rowKey?: string;
  title?: string;
  select?: Array<object>;
  rightBtn?: Array<object>;
  columns: Array<object>;
  data: Array<object>;
  total: number;
  limit?: string;
  rowSelection?: Object;
  onChange?: Function;
}

const TableComponent: React.FC<Props> = (props: Props) => {
  const {
    rowKey = 'id',
    title = '',
    select = [],
    rightBtn = [],
    columns = [],
    data = [],
    total = 0,
    limit = 10,
    onChange = () => {},
    ...argProps
  } = props;

  const [params, setParams] = useState<object>();
  const [page, setPage] = useState(1);

  const onSearch = (values: any) => {
    setParams(values);
    onChange({ ...values, page, limit });
  };
  // 表格翻页、过滤、排序触发change事件
  const handleTableChange = ({ current }: any) => {
    setPage(current);
    onChange({ ...params, page: current });
  };

  return (
    <>
      {!!select.length && (
        <Card style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Form layout="inline" onFinish={onSearch}>
              {select.map((item: any, i) => (
                <Item
                  key={item.dataIndex || i}
                  label={item.label}
                  name={item.name}
                  style={{ marginBottom: 10 }}
                >
                  {item.el}
                </Item>
              ))}
            </Form>
            <div>
              {rightBtn.map((item, i) => (
                <span key={i} style={{ marginLeft: '16px' }}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </Card>
      )}
      <Card>
        <Table
          rowKey={rowKey}
          title={() => title}
          {...argProps}
          columns={columns}
          pagination={{
            showQuickJumper: true,
            showSizeChanger: false,
            total,
            current: page,
            hideOnSinglePage: true,
          }}
          dataSource={data}
          onChange={handleTableChange}
        />
      </Card>
    </>
  );
};

export default TableComponent;
