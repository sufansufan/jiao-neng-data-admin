import React, { memo, useEffect, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Form, Input, Button, Upload, Space, Modal, Table, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getdetails, dataType, downloadTemplate, uploadFile } from '@/services/resources';
import { history } from 'umi';
import { exportData } from '@/utils';
const { Item } = Form;
const { TextArea } = Input;
const importData: React.FC<any> = (props) => {
  const { match } = props;
  const [formInfo, setFormInfo] = useState({});
  const [fileList, setFileList] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [tableData, setTableData] = useState<any>([]);
  const [detailsData, setDetailsData] = useState<any>({});
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const onFinish = (values: any) => {
    setUploadLoading(true);
    const formData = new FormData();
    formData.append('file', fileList[0]);
    formData.append('note', values.note);
    uploadFile(match.params.id, formData)
      .then(() => {
        setUploadLoading(false);
        history.go(-1);
        message.success('上传成功');
      })
      .catch(() => {
        setUploadLoading(false);
        message.error('上传失败');
      });
  };
  const uploadProps = {
    beforeUpload: (file: any) => {
      setFileList([file]);
      return false;
    },
    fileList,
  };
  const download = () => {
    downloadTemplate(match.params.id).then((res) => {
      exportData(res, '模板');
    });
  };
  const columns: any = [
    {
      title: '字段',
      dataIndex: 'attr_name',
      align: 'center',
    },
    {
      title: '说明',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '类型',
      dataIndex: 'attr_type_name',
      align: 'center',
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      const { attr_types } = await dataType();
      const details = await getdetails(match.params.id);
      await details.metadata.map((item: any) => {
        item.attr_type_name = attr_types.find((v: any) => v.value === item.attr_type).name;
      });
      await setDetailsData(details);
      await setTableData(details.metadata);
    };
    fetchData();
  }, []);
  return (
    <PageHeaderWrapper title="批量导入">
      <Card style={{ marginBottom: '20px' }}>
        <Button type="primary" onClick={download} style={{ float: 'right' }}>
          下载模板
        </Button>
      </Card>
      <Card>
        <div style={{ width: '60%', margin: '0 auto' }}>
          <Form labelCol={{ span: 4 }} initialValues={formInfo} onFinish={onFinish}>
            <Item label="表格">
              <div style={{ display: 'flex', marginTop: '3px' }}>
                <div>
                  {detailsData.name}
                  <div>{detailsData.table_name}</div>
                </div>
                <div style={{ marginLeft: '40px' }}>
                  <Button
                    type="primary"
                    onClick={() => {
                      setModalVisible(true);
                    }}
                  >
                    查看元数据
                  </Button>
                </div>
              </div>
            </Item>
            <Item label="选择文件">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>上传文件</Button>
              </Upload>
              <div>
                <p>支持扩展名：.csv</p>
                <p>请确保数据格式，和对应的表一致</p>
              </div>
            </Item>
            <Item label="说明" name="note">
              <TextArea placeholder="请输入" autoSize={{ minRows: 3, maxRows: 5 }} />
            </Item>
            <Item>
              <Space style={{ marginLeft: '17%' }}>
                <Button loading={uploadLoading} type="primary" htmlType="submit">
                  提交
                </Button>
                <Button
                  onClick={() => {
                    history.go(-1);
                  }}
                >
                  取消
                </Button>
              </Space>
            </Item>
          </Form>
        </div>
        <Modal
          width={600}
          destroyOnClose
          title="元数据"
          visible={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <Table dataSource={tableData} columns={columns} />
        </Modal>
      </Card>
    </PageHeaderWrapper>
  );
};
export default memo(importData);
