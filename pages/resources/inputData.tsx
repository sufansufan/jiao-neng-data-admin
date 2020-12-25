import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Button, Select, Space, message } from 'antd';
import { addInput } from '@/services/resources';
const { Item, List } = Form;
const { Option } = Select;

interface comProps {
  inputList?: object;
  attrType?: Array<object>;
  closeModal?: any;
}

const inputData: React.FC<comProps> = (props: comProps) => {
  const { inputList, attrType, closeModal } = props;
  const [formInfo, setFormInfo] = useState<any>({ ...inputList });
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const onFinish = (values: any) => {
    setUploadLoading(true);
    const { id } = inputList;
    const params = {
      rows: [values],
    };
    addInput(id, params)
      .then(() => {
        closeModal();
        setUploadLoading(false);
        message.success('添加成功');
      })
      .catch(() => {
        setUploadLoading(false);
      });
  };
  return (
    <Form initialValues={formInfo} onFinish={onFinish}>
      <Item label="表格">
        <div style={{ display: 'flex', marginTop: '3px' }}>
          <div>
            {formInfo.name}
            <div>{formInfo.table_name}</div>
          </div>
        </div>
      </Item>
      {formInfo.metadata.map((item: any, index: any) => (
        <Item
          key={item.id}
          name={item.attr_name}
          rules={[{ required: true, message: `请输入${item.name}` }]}
        >
          <Space align="start">
            <div style={{ marginTop: '-7px', minWidth: '90px' }}>
              <div>{item.name}</div>
              <div>{item.attr_name}</div>
            </div>
            <Input placeholder="请输入" style={{ width: '300px' }} />
            <div style={{ marginTop: '3px' }}>{item.attr_type}</div>
          </Space>
        </Item>
      ))}
      <Item>
        <Button loading={uploadLoading} type="primary" htmlType="submit" style={{ float: 'right' }}>
          提交
        </Button>
      </Item>
    </Form>
  );
};
export default memo(inputData);
