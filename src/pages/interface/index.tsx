/* eslint-disable react/no-danger */
/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect, memo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Space, Form, Button, Input, Select, Modal, message, Popconfirm, Tag } from 'antd';
import Table from '@/components/Table';
import {
  getServicesList,
  switchState,
  getResourcesList,
  editServices,
  addServices,
} from '@/services/interface';
import { useDebounce } from '@/utils/hooks';
import dayjs from 'dayjs';

const { Item } = Form;
const { Option } = Select;

const InterFace: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalInfo, setModalInfo] = useState<any>({});
  const [total, setTotal] = useState(100);
  const [tableData, setTableData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [resourcesList, setResourcesList] = useState<any>([]);

  const [form] = Form.useForm();

  const getData = (params: any = {}) => {
    getServicesList({ ...params, page: params.page || 1, limit: 10, q: searchValue }).then(
      (res: any) => {
        const { total_count, services } = res;
        setTotal(total_count);
        setTableData(services);
      },
    );
  };

  const onFinish = async (values: any) => {
    if (modalInfo.id) {
      await editServices(modalInfo.id, { ...values }).then(() => {
        message.success('编辑成功');
        setModalVisible(false);
      });
    } else {
      await addServices({ ...values, permission_type: 'LIST', permission_name: '列表' }).then(
        () => {
          message.success('添加成功');
          setModalVisible(false);
        },
      );
    }
    getData();
  };

  const handleEdit = async (item: any = {}) => {
    getOptionsList();
    setModalInfo(item);
    await setModalVisible(true);
    form.resetFields();
  };

  const handleDisabled = ({ id, disabled }: any): void => {
    switchState(id).then(() => {
      message.success(`${disabled ? '启' : '禁'}用成功`);
      getData();
    });
  };

  const getOptionsList = useDebounce((value: string = '') => {
    getResourcesList({ q: value }).then((res) => {
      setResourcesList(res.resources);
    });
  }, 800);

  useEffect(() => {
    getData();
  }, []);

  const rightBtn = [
    <Button type="primary" onClick={() => handleEdit()}>
      添加
    </Button>,
  ];

  const select = [
    {
      name: 'key',
      label: false,
      el: (
        <Input.Search
          value={searchValue}
          placeholder="请输入关键字"
          onChange={(e) => {
            e.persist();
            setSearchValue(e.target.value);
          }}
          style={{ width: 400 }}
        />
      ),
    },
    {
      el: (
        <Button type="primary" htmlType="submit">
          筛选
        </Button>
      ),
    },
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
      title: '资源名称',
      dataIndex: 'resource_name',
      align: 'center',
    },
    {
      title: '子公司',
      dataIndex: 'company_name',
      align: 'center',
    },
    {
      title: '状态',
      dataIndex: 'disabled',
      align: 'center',
      render: (disabled: any) => (
        <Tag color={`${disabled === 1 ? '#f50' : '#87d068'}`}>
          {disabled === 1 ? '禁用' : '启用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      align: 'center',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD hh:mm:ss'),
    },
    {
      title: '操作',
      align: 'center',
      render: (item: any) => (
        <Space size="middle">
          <a onClick={() => handleEdit(item)}>维护</a>
          <Popconfirm
            title={`确定${item.disabled ? '启用' : '禁用'}`}
            onConfirm={() => handleDisabled(item)}
            okText="是"
            cancelText="否"
          >
            <a>{item.disabled ? '启用' : '禁用'}</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
      <Table
        title="接口列表"
        rightBtn={rightBtn}
        select={select}
        columns={columns}
        data={tableData}
        total={total}
        onChange={(params: object) => getData(params)}
      />
      <Modal
        width={600}
        destroyOnClose
        title={`${modalInfo.id ? '编辑' : '添加'}预案`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          labelCol={{ span: 4 }}
          onFinish={onFinish}
          initialValues={modalInfo}
          validateMessages={{ required: '${label} 必填!' }}
        >
          <Item label="资源" name="resource_id" rules={[{ required: !modalInfo.id }]}>
            {modalInfo.id ? (
              <Input
                style={{ width: '50%' }}
                disabled
                defaultValue={`${modalInfo.resource_name}(${modalInfo.table_name})`}
              />
            ) : (
              <Select
                showSearch
                placeholder="请选择"
                style={{ width: '50%' }}
                optionFilterProp="children"
                onChange={(val: string) => getOptionsList(val)}
                filterOption={(input, option: any) => option.children.includes(input)}
              >
                {resourcesList.map((item: any) => (
                  <Option value={item.id} key={item.id}>
                    {item.source_name}({item.table_name})
                  </Option>
                ))}
              </Select>
            )}
          </Item>
          <Item label="名称" name="name">
            <Input style={{ width: 'calc(50%)' }} />
          </Item>
          <Item label="类型">
            <Input defaultValue="列表" disabled style={{ width: 'calc(50%)' }} />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
              保存
            </Button>
          </Item>
        </Form>
      </Modal>
    </PageHeaderWrapper>
  );
};

export default memo(InterFace);
