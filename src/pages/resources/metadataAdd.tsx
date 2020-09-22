import React, { memo, useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card, Form, Input, Space, Select, message } from 'antd';

import styles from './styles/metadataAdd.less';
import { isExistName, addResources, dataType, getCompany } from '@/services/resources';

const { Item, List } = Form;
const { Option } = Select;

const metadataAdd: React.FC<{}> = () => {
  const [formInfo, setFormInfo] = useState({
    name: '',
    table_name: '',
    metadata: [{}],
  });
  const [tableNameStatus, setTableNameStatus] = useState('none');
  const [selectData, setSelectData] = useState({
    attrType: [],
    companyList: [],
  });
  const onFinish = async (values: any) => {
    const { exist } = await isExistName({ table_name: values.table_name });
    if (exist) {
      setTableNameStatus('block');
    } else {
      addResources(values).then(() => {
        message.success('添加成功');
      });
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const { companies } = await getCompany();
      const { attr_types } = await dataType();
      setSelectData({
        companyList: companies,
        attrType: attr_types,
      });
    };
    fetchData();
  }, []);
  return (
    <PageHeaderWrapper title="元数据录入">
      <Card style={{ marginBottom: '20px' }}>
        <div style={{ width: '45%', margin: '0 auto' }}>
          <Form
            initialValues={formInfo}
            layout="horizontal"
            onFinish={onFinish}
            className={styles.formInfo}
            validateMessages={{ required: '${label} 必填!' }}
          >
            <div>
              <Item label="名称" name="name" rules={[{ required: true }]}>
                <Input placeholder="请输入" style={{ width: '200px' }} />
              </Item>
              <div style={{ display: 'flex' }}>
                <Item label="表名" name="table_name" rules={[{ required: true }]}>
                  <Input placeholder="请输入" style={{ width: '200px' }} />
                </Item>
                <span
                  style={{
                    marginLeft: '30px',
                    lineHeight: '30px',
                    color: '#ff4d4f',
                    display: tableNameStatus,
                  }}
                >
                  表名已存在请换个名字
                </span>
              </div>
              <div style={{ margin: '-10px 0px 20px 50px' }}>
                表名不能重复，只能是字母开头，允许字母数字下划线
              </div>
              <Item label="公司" name="company_id" rules={[{ required: true }]}>
                <Select allowClear={true} placeholder="请选择" style={{ width: '200px' }}>
                  {selectData.companyList.map((item: any, index: any) => (
                    <Option value={item.id} key={index}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Item>
            </div>
            <div className={styles.name}>元数据</div>
            <div style={{ width: '33.33%' }}>
              <div style={{ color: 'rgba(0,0,0,0.85)' }}>字段</div>
              <div>字母数字下划线</div>
            </div>
            <div style={{ width: '33.33%', color: 'rgba(0,0,0,0.85)' }}> 说明</div>
            <div style={{ width: '33.33%', color: 'rgba(0,0,0,0.85)' }}> 类型</div>
            <List name="metadata">
              {(fields, { add, remove }) => {
                return (
                  <div className={styles.formInfo}>
                    {fields.map((field) => (
                      <Space key={field.key} className={styles.space} align="start">
                        <Item {...field} name={[field.name, 'attr_name']}>
                          <Input placeholder="请输入" />
                        </Item>
                        <Item {...field} name={[field.name, 'name']}>
                          <Input placeholder="请输入" />
                        </Item>
                        <Item {...field} name={[field.name, 'attr_type']}>
                          <Select allowClear={true} placeholder="请选择" style={{ width: '150px' }}>
                            {selectData.attrType.map((item: any, index: any) => (
                              <Option value={item.value} key={index}>
                                {item.name}
                              </Option>
                            ))}
                          </Select>
                        </Item>
                      </Space>
                    ))}
                    <div className={styles.addData}>
                      <Button type="text" onClick={add} style={{ color: '#1890ff' }}>
                        增加元数据 <PlusCircleOutlined />
                      </Button>
                    </div>
                  </div>
                );
              }}
            </List>
            <Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
                <Button>取消</Button>
              </Space>
            </Item>
          </Form>
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};
export default memo(metadataAdd);
