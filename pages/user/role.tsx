/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect, memo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {Space, Form, Button, Input, Modal, message, Popconfirm, Checkbox, Row, Col, Spin, Select} from 'antd';
import Table from '@/components/Table';
import {getRoleList, addAndEditRole, deleteRole, findRoleListSearch, getUserSearch} from '@/services/user';
import { ROLE_CONFIG } from '@/utils/authority';
import {useDebounce} from "@/utils/hooks";

const { Item } = Form;

interface comProps {
  title: string;
  operationType: number;
}

interface itemProps {
  id?: string;
  name?: string;
  rIds?: string | string[];
}

const UnitList: React.FC<comProps> = (props: comProps) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [modalInfo, setModalInfo] = useState<itemProps>({});
  const [searchInfo, setSearchInfo] = useState({
    value: [],
    list: [],
    fetching: false,
  });
  const { title = '角色' } = props;

  const handleEdit = (item: itemProps) => {
    const { id, name, rIds = [] } = item;
    const menu = rIds.split(',');
    setModalInfo({
      id,
      name,
      rIds: menu,
    });
    setModalVisible(true);
  };

  const getData = (params: any = {}) => {
    const { key } = params;
    getRoleList({ ...params, key: key?.[0]?.key }).then((res) => {
      const { count, list } = res.data;
      setTotal(count);
      setTableData(list);
    });
  };
  const onFinish = (values: any) => {
    const { id } = modalInfo;
    const { rIds, name } = values;
    let role = rIds;
    if (Array.isArray(rIds)) {
      role = rIds.join(',');
    }
    addAndEditRole({ id, menu: role, name }).then(() => {
      setModalVisible(false);
      message.success('编辑成功');
      getData();
    });
  };

  const getSearchList = useDebounce((value: string) => {
    setSearchInfo((pre) => ({ ...pre, list: [], fetching: true }));
    findRoleListSearch({ key: value }).then((res) => {
      setSearchInfo((pre) => ({ ...pre, list: res.data.list, fetching: false }));
    });
  }, 800);
  const onFinishFailed = (): void => {
    // console.log('Failed:', errorInfo);
  };

  const handleDel = (id?: string): void => {
    deleteRole({ id }).then(() => {
      message.success('删除成功');
      getData();
    });
  };

  useEffect(() => {
    getData();
  }, []);

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
  const rightBtn = [
    <Button
      type="primary"
      onClick={() => {
        setModalInfo({});
        setModalVisible(true);
      }}
    >
      添加
    </Button>,
  ];
  const columns = [
    {
      title: `${title}名称`,
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '页面权限',
      dataIndex: 'mName',
      align: 'center',
    },
    {
      title: '操作',
      align: 'center',
      render: (item: itemProps) => (
        <Space size="middle">
          <a onClick={() => handleEdit(item)}>编辑</a>
          <Popconfirm
            title="确定删除"
            onConfirm={() => handleDel(item.id)}
            okText="是"
            cancelText="否"
          >
            <a>删除</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
      <Table
        title={`${title}列表`}
        select={select}
        rightBtn={rightBtn}
        columns={columns}
        data={tableData}
        total={total}
        onChange={(params: object) => getData(params)}
      />

      <Modal
        destroyOnClose
        title={`${modalInfo.id ? '编辑' : '添加'}${title}`}
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          initialValues={modalInfo}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          validateMessages={{ required: '${label} 必填!' }}
        >
          <Item label={`${title}名称`} name="name" rules={[{ required: !modalInfo.id }]}>
            <Input
              disabled={!!modalInfo.id}
              placeholder="请输入"
              style={{ width: 'calc(50% - 33px)' }}
            />
          </Item>

          <Item name="rIds" label="设置权限" rules={[{ required: !modalInfo.id }]}>
            <Checkbox.Group
              style={{ width: '100%' }}
              onChange={(checkedValues) => {
                console.log('checked = ', checkedValues);
              }}
            >
              {ROLE_CONFIG.map((item) => (
                <Row key={item.value}>
                  <Col span={24}>
                    <Checkbox value={item.value} style={{ lineHeight: '32px' }}>
                      {item.label}
                    </Checkbox>
                    <Row style={{ paddingLeft: '25px' }}>
                      {item.children.map((child) => (
                        <Col key={child.value} span={24 / item.children.length}>
                          <Checkbox value={child.value} style={{ lineHeight: '32px' }}>
                            {child.label}
                          </Checkbox>
                        </Col>
                      ))}
                    </Row>
                  </Col>
                </Row>
              ))}
            </Checkbox.Group>
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

export default memo(UnitList);
