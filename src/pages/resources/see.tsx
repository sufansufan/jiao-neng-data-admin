import React, { memo, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Select, Space, Modal, Form, message, Input, Popconfirm } from 'antd';

import Table from '@/components/Table';
import {
  getResourceRows,
  deleteResourceRows,
  dataType,
  updateResourceRows,
} from '@/services/resources';

const { Item } = Form;
const { Option } = Select;

const see: React.FC<any> = (props) => {
  const [total, setTotal] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [attrType, setAttrType] = useState([]);
  const [formInfo, setFormInfo] = useState<any>({});
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);

  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    setUploadLoading(true);
    const { row_id, id } = formInfo;
    const { attr_name, attr_type, name } = values;
    const params = {
      row_id,
      resource_id: props.match.params.id,
      data: {
        attr_name,
        attr_type,
        name,
        id,
      },
    };
    updateResourceRows(params)
      .then(() => {
        message.success('修改成功');
        setUploadLoading(false);
        setModalVisible(false);
        getData();
      })
      .catch(() => {
        setUploadLoading(false);
      });
  };
  const getData = (params: object = {}) => {
    const paramsObj = { page: 1, limit: 10, resource_id: props.match.params.id, ...params };
    getResourceRows(paramsObj).then(({ rows, total_count }) => {
      setTableData(rows);
      setTotal(total_count);
    });
  };
  const handleDelete = (item: any) => {
    const params = {
      rows_ids: [item.row_id],
      resource_id: props.match.params.id,
    };
    deleteResourceRows(params).then(() => {
      message.success('删除成功');
      getData();
    });
  };
  const handleEdit = (item: any) => {
    const {
      row_id,
      data: { attr_name, attr_type, name, id },
    } = item;
    setFormInfo({
      row_id,
      attr_name,
      attr_type,
      name,
      id,
    });
    setModalVisible(true);
  };
  useEffect(() => {
    getData();
    dataType().then(({ attr_types }) => {
      setAttrType(attr_types);
    });
  }, []);
  const columns = [
    {
      title: '字段',
      render: (item: any) => <span>{item.data.attr_name}</span>,
    },
    {
      title: '说明',
      render: (item: any) => <span>{item.data.name}</span>,
    },
    {
      title: '类型',
      render: (item: any) => <span>{item.data.attr_type}</span>,
    },
    {
      title: '操作',
      render: (item: any) => (
        <Space size="middle">
          <a onClick={() => handleEdit(item)}>修改</a>
          <Popconfirm
            title={`确定是否删除`}
            onConfirm={() => handleDelete(item)}
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
    <PageHeaderWrapper title="查看资源">
      <Table
        columns={columns}
        data={tableData}
        total={total}
        onChange={(params: object) => getData(params)}
      />
      <Modal
        width={600}
        destroyOnClose
        title="修改资源"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          initialValues={formInfo}
          onFinish={onFinish}
          validateMessages={{ required: '${label} 必填!' }}
        >
          <Item label="字段" name="attr_name" rules={[{ required: true }]}>
            <Input placeholder="请输入" style={{ width: '200px' }} />
          </Item>
          <Item label="说明" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入" style={{ width: '200px' }} />
          </Item>
          <Item label="类型" name="attr_type" rules={[{ required: true }]}>
            <Select allowClear={true} placeholder="请选择" style={{ width: '200px' }}>
              {attrType.map((item: any, index: any) => (
                <Option value={item.name} key={index}>
                  {item.name}
                </Option>
              ))}
            </Select>
          </Item>
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
    </PageHeaderWrapper>
  );
};

export default memo(see);
