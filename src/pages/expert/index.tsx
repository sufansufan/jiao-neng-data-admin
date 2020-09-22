/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect, memo } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Space, Form, Button, Input, Modal, message, Popconfirm, Select, Spin } from 'antd';
import { useDebounce } from '@/utils/hooks';
import Table from '@/components/Table';
import {
  getTechnocracyList,
  addAndEditExpert,
  deleteTechnocracyList,
  getTechnocracyListSearch,
} from '@/services/expert';
import { getAuthority } from '@/utils/authority';

const { Item } = Form;
const { Option } = Select;

interface itemProps {
  id?: string;
  name?: string;
  company?: string;
  territory?: string;
  mobile?: string;
  introduce?: string;
}

const ExpertList: React.FC<{}> = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [total, setTotal] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [modalInfo, setModalInfo] = useState<itemProps>({});
  const [searchInfo, setSearchInfo] = useState({
    value: [],
    list: [],
    fetching: false,
  });
  const menuIds = getAuthority();

  const handleEdit = (item: itemProps) => {
    setModalInfo(item);
    setModalVisible(true);
  };

  const getData = (params: any = {}) => {
    const { key } = params;
    getTechnocracyList({ ...params, id: key?.[0]?.key, key: '' }).then((res) => {
      const { count, list } = res.data;
      setTotal(count);
      setTableData(list);
    });
  };
  const onFinish = (values: any) => {
    const { id } = modalInfo;
    addAndEditExpert({ id, ...values }).then(() => {
      setModalVisible(false);
      message.success(`${id ? '编辑' : '添加'}成功`);
      getData();
    });
  };

  const onFinishFailed = (): void => {
    // console.log('Failed:', errorInfo);
  };

  const handleDel = (id?: string): void => {
    deleteTechnocracyList({ id }).then(() => {
      message.success('删除成功');
      getData();
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getSearchList = useDebounce((value: string) => {
    setSearchInfo((pre) => ({ ...pre, list: [], fetching: true }));
    getTechnocracyListSearch({ key: value }).then((res) => {
      setSearchInfo((pre) => ({ ...pre, list: res.data.list, fetching: false }));
    });
  }, 800);

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
          {searchInfo.list.map((item: any) => (
            <Option value={item.id} key={item.id}>
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
  const rightBtn = menuIds.includes('3-2')
    ? [
        <Button
          type="primary"
          onClick={() => {
            setModalInfo({});
            setModalVisible(true);
          }}
        >
          添加
        </Button>,
      ]
    : [];
  const columns = [
    {
      title: '专家姓名',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '所属单位',
      dataIndex: 'company',
      align: 'center',
    },
    {
      title: '擅长领域',
      dataIndex: 'territory',
      align: 'center',
    },
    {
      title: '联系方式',
      dataIndex: 'mobile',
      align: 'center',
    },
    {
      title: '专家介绍',
      dataIndex: 'introduce',
      width: 600,
      align: 'center',
      render: (text: string) => (
        <p
          style={{
            display: '-webkit-box',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: 3,
            overflow: 'hidden',
          }}
        >
          {text}
        </p>
      ),
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
        title="专家列表"
        select={select}
        rightBtn={rightBtn}
        columns={columns}
        data={tableData}
        total={total}
        onChange={(params: object) => getData(params)}
      />

      <Modal
        destroyOnClose
        title={`${modalInfo.id ? '编辑' : '添加'}专家`}
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
          <Item label="单位名称" name="company" rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Item>
          <Item label="专家姓名" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Item>
          <Item
            label="联系电话"
            name="mobile"
            rules={[
              { required: true },
              () => ({
                validator(rule, value) {
                  const regex = /^((\+)?86|((\+)?86)?)0?1[3-9]\d{9}$/;
                  if (value) {
                    if (regex.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject('请输入正确的手机号码！');
                  }
                  return Promise.reject('请输入正确的手机号码！');
                },
              }),
            ]}
          >
            <Input placeholder="请输入" />
          </Item>
          <Item label="擅长领域" name="territory" rules={[{ required: true }]}>
            <Input placeholder="请输入" />
          </Item>
          <Item label="专家介绍" name="introduce" rules={[{ required: true }]}>
            <Input.TextArea
              autoSize={{ minRows: 5, maxRows: 12 }}
              maxLength={300}
              placeholder="请输入"
            />
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

export default memo(ExpertList);
