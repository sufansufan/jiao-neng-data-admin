import React, { memo, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Select, Space, Spin, Modal, Form, message, Input } from 'antd';
import { history } from 'umi';

import Table from '@/components/Table';
import InputData from './inputData';
import {
  getCompany,
  getContentsList,
  dataType,
  isExistName,
  addResources,
  editResources,
  getdetails,
} from '@/services/resources';
import styles from './styles/metadataAdd.less';

const { Option } = Select;
const { Item, List } = Form;

interface itemProps {
  id?: string;
  name?: string;
  table_name?: string;
  company_id?: string;
  metadata?: Array<object>;
}
const contents: React.FC<{}> = () => {
  const [total, setTotal] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [searchInfo, setSearchInfo] = useState({
    value: '',
    fetching: false,
    companyId: '',
    companyList: [],
  });
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [inputModalVisible, setInputModalVisible] = useState<boolean>(false);
  const [formInfo, setFormInfo] = useState<any>({
    metadata: [{}],
  });
  const [inputData, setInputData] = useState<any>({});
  const [tableNameStatus, setTableNameStatus] = useState('none');
  const [attrType, setAttrType] = useState([]);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    const { exist } = await isExistName({ table_name: values.table_name, id: formInfo.id });
    const { id } = formInfo;
    if (exist && !id) {
      setTableNameStatus('block');
    } else {
      setUploadLoading(true);
      if (id) {
        const { name, company_id } = values;
        editResources({ name, company_id }, id)
          .then(() => {
            setUploadLoading(false);
            setModalVisible(false);
            getData();
            message.success('修改成功');
          })
          .catch(() => {
            setUploadLoading(false);
          });
      } else {
        if (!values.metadata) {
          setUploadLoading(false);
          message.warning('请添加一条元数据');
          return
        }
        addResources(values)
          .then(() => {
            setUploadLoading(false);
            setModalVisible(false);
            getData();
            message.success('添加成功');
          })
          .catch(() => {
            setUploadLoading(false);
          });
      }
    }
  };
  const getData = (params: object = {}) => {
    getContentsList({ page: 1, limit: 10, ...params }).then(({ resources, total_count }) => {
      setTableData(resources);
      setTotal(total_count);
    });
  };
  const handleEdit = async (item: itemProps = {}) => {
    setFormInfo(item);
    setTableNameStatus('none');
    await setModalVisible(true);
    form.resetFields();
  };
  const handleInput = async (item: itemProps = {}) => {
    const details = await getdetails(item.id);
    await setInputData(details);
    await setInputModalVisible(true);
  };
  const handleImport = (item: itemProps = {}) => {
    history.push('/resources/importData/' + item.id);
  };
  useEffect(() => {
    const fetchData = async () => {
      const { companies } = await getCompany();
      const { attr_types } = await dataType();
      setAttrType(attr_types);
      setSearchInfo({
        ...searchInfo,
        companyList: companies,
      });
      await getData();
    };
    fetchData();
  }, []);
  const select = [
    {
      name: 'q',
      label: '关键字',
      el: (
        <Input
          value={searchInfo.value}
          placeholder="请输入关键字"
          onChange={(e) => {
            e.persist();
            setSearchInfo({ ...searchInfo, value: e.target.value });
          }}
          style={{ width: 200 }}
        />
      ),
    },
    {
      name: 'company_id',
      label: '子公司',
      el: (
        <Select
          value={searchInfo.companyId}
          allowClear={true}
          onChange={(value: any) => {
            setSearchInfo({
              ...searchInfo,
              companyId: value,
            });
          }}
          style={{ width: '200px' }}
        >
          {searchInfo.companyList.map((item: any, index: any) => (
            <Option value={item.id} key={index}>
              {item.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      el: (
        <Button type="primary" htmlType="submit">
          搜索
        </Button>
      ),
    },
  ];
  const rightBtn = [
    <Button type="primary" onClick={() => handleEdit()}>
      添加
    </Button>,
  ];
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '表名',
      dataIndex: 'table_name',
      align: 'center',
    },
    {
      title: '子公司',
      dataIndex: 'company_name',
      align: 'center',
    },
    {
      title: '来源',
      dataIndex: 'source_name',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (item: itemProps) => (
        <Space size="middle">
          <a onClick={() => handleEdit(item)}>维护</a>
          <a onClick={() => handleInput(item)}>手动输入</a>
          <a onClick={() => handleImport(item)}>批量导入</a>
          <a onClick={() => history.push('/resources/see/' + item.id)}>查看数据</a>
        </Space>
      ),
    },
  ];
  return (
    <PageHeaderWrapper title="资源目录">
      <Table
        select={select}
        rightBtn={rightBtn}
        columns={columns}
        data={tableData}
        total={total}
        onChange={(params: object) => getData(params)}
      />
      <Modal
        width={600}
        destroyOnClose
        title={`${formInfo.id ? '编辑' : '添加'}资源`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
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
            <Item label="公司" name="company_id" rules={[{ required: true }]}>
              <Select allowClear={true} placeholder="请选择" style={{ width: '200px' }}>
                {searchInfo.companyList.map((item: any, index: any) => (
                  <Option value={item.id} key={index}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Item>
          </div>
          {formInfo.id ? (
            ''
          ) : (
            <>
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
              <div className={styles.name}>元数据</div>
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
                            <Select
                              allowClear={true}
                              placeholder="请选择"
                              style={{ width: '150px' }}
                            >
                              {attrType.map((item: any, index: any) => (
                                <Option value={item.value} key={index}>
                                  {item.name}
                                </Option>
                              ))}
                            </Select>
                          </Item>
                          <CloseCircleOutlined
                            style={{ color: '#999999', fontSize: '18px', margin: '7px 0 0 10px' }}
                            onClick={() => {
                              remove(field.name);
                            }}
                          />
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
            </>
          )}
          <Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={uploadLoading}
              style={{ float: 'right', marginTop: '40px' }}
            >
              提交
            </Button>
          </Item>
        </Form>
      </Modal>
      <Modal
        width={600}
        destroyOnClose
        title="手动输入"
        visible={inputModalVisible}
        onCancel={() => setInputModalVisible(false)}
        footer={null}
      >
        <InputData
          inputList={inputData}
          attrType={attrType}
          closeModal={() => {
            setInputModalVisible(false);
          }}
        />
      </Modal>
    </PageHeaderWrapper>
  );
};

export default memo(contents);
