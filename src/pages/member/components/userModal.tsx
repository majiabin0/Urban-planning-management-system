import React, { useEffect, FC } from "react";
import { Drawer, Button, Form, Input, message, DatePicker, Switch, Tooltip, Tabs  } from "antd";
import {
  InfoCircleFilled
} from "@ant-design/icons"
import { SingleUserType, FormValues } from "../data.d";
import moment from "moment";

interface UserModalProps {
  visible: boolean;
  record: SingleUserType | undefined;
  closeHandler: () => void;
  onFinish: (values: FormValues) => void;
  confirmLoading: boolean;
}

const UserModal: FC<UserModalProps> = props => {
  const [form] = Form.useForm();
  const { visible, record, closeHandler, onFinish, confirmLoading } = props;

  useEffect(() => {
    if (record === undefined) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        ...record,
        // create_time: moment(record.create_time),
        status: Boolean(record.status)
      });
    }
  }, [visible]);

  const onOk = () => {
    form.submit();
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo.errorFields[0].errors[0]);
  };

  return (
    <div>
      <Drawer
        title={record ? "配置" + record.name : "配置站点"}
        visible={visible}
        width="520px"
        // onOk={onOk}
        onClose={closeHandler}
        forceRender
        // confirmLoading={confirmLoading}
        footer={
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <Button onClick={closeHandler} style={{ marginRight: 8 }}>
              关闭
            </Button>
            <Button onClick={onOk} type="primary" loading={confirmLoading}>
              保存
            </Button>
          </div>
        }
      >
        <Form
          name="basic"
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            status: true
          }}
        >
          <Form.Item
            label="成员名称"
            name="name"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="用户名称"
            name="username"
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
              label="图片"
              name="avatar"
          >
            <Input size="large" />
          </Form.Item>
          {/*<Form.Item*/}
          {/*    label="角色"*/}
          {/*    name="role"*/}
          {/*>*/}
          {/*  <Input size="large" />*/}
          {/*</Form.Item>*/}
          <Form.Item
              label="角色ID"
              name="roleId"
          >
            <Input size="large" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UserModal;
