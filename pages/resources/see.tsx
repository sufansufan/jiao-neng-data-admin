import React, { memo, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Select, Space, Modal, Form, message, Input, Popconfirm, Tooltip } from 'antd';

import Table from '@/components/Table';
import {
  getResourceRows,
  deleteResourceRows,
  updateResourceRows,
  getdetails,
} from '@/services/resources';

const { Item } = Form;
const { TextArea } = Input;

const see: React.FC<any> = (props) => {
  const [total, setTotal] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formInfo, setFormInfo] = useState<any>({});
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [detailsInfo, setDetailsInfo] = useState<any>([]);
  const [columns, setColumns] = useState<any>([]);
  const [form] = Form.useForm();
  const onFinish = async (values: any) => {
    setUploadLoading(true);
    const { row_id } = formInfo;
    const params = {
      row_id,
      resource_id: props.match.params.id,
      data: {
        ...values,
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
    const { row_id, data } = item;
    setFormInfo({
      row_id,
      ...data,
    });
    setModalVisible(true);
  };
  const handlerColumns = (details: any) => {
    const list = [];
    details.metadata.forEach((item: any) => {
      list.push({
        title: `${item.name}( ${item.attr_name} )`,
        ellipsis: {
          showTitle: false,
        },
        render: (v: any) => (
          <Tooltip placement="topLeft" title={v.data[item.attr_name]}>
            <span>{v.data[item.attr_name]}</span>
          </Tooltip>
        ),
      });
    });
    list.push({
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
    });
    setColumns(list);
  };
  useEffect(() => {
    const fetchData = async () => {
      const details = await getdetails(props.match.params.id);
      await setDetailsInfo(details);
      await handlerColumns(details);
      await getData();
    };
    fetchData();
  }, []);
  const layout = {
    labelCol: { span: 7 },
    // wrapperCol: { span: 8 },
  };
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
        title="修改数据"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form {...layout} form={form} initialValues={formInfo} onFinish={onFinish}>
          {detailsInfo.metadata &&
            detailsInfo.metadata.map((item: any) => (
              <Item label={item.name} name={item.attr_name}>
                {item.attr_type === 'text' ? (
                  <TextArea rows={2} placeholder="请输入" />
                ) : (
                  <Input placeholder="请输入" style={{ width: '390px' }} />
                )}
              </Item>
            ))}
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
