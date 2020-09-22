import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Button, Select, Space, message } from 'antd';
import styles from './styles/metadataAdd.less';
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
  const metaList: any = [];
  inputList.metadata.map((item: any) => {
    let obj = {};
    for (const key in item) {
      obj[key] = '';
    }
    metaList.push(obj);
  });
  const [formInfo, setFormInfo] = useState<any>({ ...inputList, metadata: metaList });
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const onFinish = (values: any) => {
    setUploadLoading(true);
    const { id } = inputList;
    const params = {
      rows: values.metadata,
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
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '33.33%' }}>
          <div style={{ color: 'rgba(0,0,0,0.85)' }}>字段</div>
          <div>字母数字下划线</div>
        </div>
        <div style={{ width: '33.33%', color: 'rgba(0,0,0,0.85)' }}> 说明</div>
        <div style={{ width: '33.33%', color: 'rgba(0,0,0,0.85)' }}> 类型</div>
      </div>
      <List name="metadata">
        {(fields, { add, remove }) => {
          return (
            <div className={styles.formInfo}>
              {fields.map((field) => (
                <Space key={field.key} className={styles.space} align="start">
                  <Item
                    {...field}
                    name={[field.name, 'attr_name']}
                    rules={[{ required: true, message: '字段 必填' }]}
                  >
                    <Input placeholder="请输入" />
                  </Item>
                  <Item
                    {...field}
                    name={[field.name, 'name']}
                    rules={[{ required: true, message: '说明 必填' }]}
                  >
                    <Input placeholder="请输入" />
                  </Item>
                  <Item
                    {...field}
                    name={[field.name, 'attr_type']}
                    rules={[{ required: true, message: '类型 必填' }]}
                  >
                    <Select allowClear={true} placeholder="请选择" style={{ width: '200px' }}>
                      {attrType.map((item: any, index: any) => (
                        <Option value={item.value} key={index}>
                          {item.name}
                        </Option>
                      ))}
                    </Select>
                  </Item>
                </Space>
              ))}
            </div>
          );
        }}
      </List>
      <Item>
        <Button loading={uploadLoading} type="primary" htmlType="submit" style={{ float: 'right' }}>
          提交
        </Button>
      </Item>
    </Form>
  );
};
export default memo(inputData);
