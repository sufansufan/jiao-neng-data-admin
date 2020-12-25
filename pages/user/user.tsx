import React, { useState, useEffect, memo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Space, Form, Button, Select, Modal, message, Spin } from 'antd';
import Table from '@/components/Table';
import { getUserList, getRoleList, editUserRole, getUserSearch } from '@/services/user';
import { useDebounce } from '@/utils/hooks';

const { Item } = Form;
const { Option } = Select;

interface itemProps {
  id?: string;
  name?: string;
  rName?: string;
  mobile?: string;
  role?: string;
  roleId?: string;
}
const UserList: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [total, setTotal] = useState(100);
  const [tableData, setTableData] = useState([]);
  const [modalInfo, setModalInfo] = useState<itemProps>({});
  const [searchInfo, setSearchInfo] = useState({
    value: [],
    list: [],
    fetching: false,
  });
  const [ruleList, setRuleList] = useState([]);

  const getSearchList = useDebounce((value: string) => {
    setSearchInfo((pre) => ({ ...pre, list: [], fetching: true }));
    getUserSearch({ key: value }).then((res) => {
      setSearchInfo((pre) => ({ ...pre, list: res.data.list, fetching: false }));
    });
  }, 800);

  const getRuleList = () => {
    getRoleList({}).then((res) => {
      setRuleList(res.data.list);
    });
  };

  const handleEdit = (item: itemProps) => {
    getRuleList();
    setModalInfo({ ...item, role: item.roleId });
    setModalVisible(true);
  };

  const select = [
    {
      name: 'key',
      label: false,
      el: (
        <Select
          mode="multiple"
          labelInValue
          value={searchInfo.value}
          placeholder="请输入关键字"
          notFoundContent={searchInfo.fetching ? <Spin size="small" /> : null}
          filterOption={false}
          onSearch={getSearchList}
          onChange={(value) =>
            setSearchInfo({
              value,
              list: [],
              fetching: false,
            })
          }
          style={{ width: '300px' }}
        >
          {searchInfo.list.map((item: any, index) => (
            <Option value={item.id} key={index}>
              {item.value}
            </Option>
          ))}
        </Select>
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
      title: '姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'rName',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (item: itemProps) => (
        <Space size="middle">
          <a onClick={() => handleEdit(item)}>编辑</a>
        </Space>
      ),
    },
  ];
  const getData = (params: any = {}) => {
    const { key } = params;
    getUserList({ ...params, key: key?.[0]?.key }).then((res) => {
      const { count, list } = res.data;
      setTotal(count);
      setTableData(list);
    });
  };
  const onFinish = (values: any) => {
    const { id } = modalInfo;
    editUserRole({ id, ...values }).then(() => {
      setModalVisible(false);
      message.success('编辑成功');
      getData();
    });
  };

  const onFinishFailed = () => {
    // console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <PageHeaderWrapper title={false}>
      <Table
        title="用户列表"
        select={select}
        columns={columns}
        data={tableData}
        total={total}
        onChange={(params: object) => getData(params)}
      />
      <Modal
        destroyOnClose
        title="编辑用户"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={modalInfo}
          labelCol={{ span: 4 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Item label="姓名">
            <span>{modalInfo.name}</span>
          </Item>
          <Item label="手机号">
            <span>{modalInfo.mobile}</span>
          </Item>
          <Item label="选择角色" name="role">
            <Select placeholder="请选择" style={{ width: 'calc(50%)' }}>
              {ruleList.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              ))}
            </Select>
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

export default memo(UserList);
