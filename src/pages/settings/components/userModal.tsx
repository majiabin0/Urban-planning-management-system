import React, { useEffect, FC } from "react";
import { Drawer, Button, Form, Input, message, DatePicker, Switch, Tooltip } from "antd";
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
            label="站点名称"
            name="name"
            rules={[{ required: true }]}
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="模板文件夹"
            name="template"
            rules={[{ required: true }]}
          >
            <Input size="large" disabled />
          </Form.Item>
          <Form.Item
            label="ICP备案号"
            name="icpNo"
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label="SEO标题"
            name="seoTitle"
          >
            <Input size="large" />
          </Form.Item>
          <Form.Item
            label={
              <>
                <span>SEO关键字</span>
                <Tooltip title="多个关键词以英文逗号分隔">
                  <InfoCircleFilled
                    style={{
                      marginTop: -2,
                      marginLeft: 4,
                      opacity: 0.5
                    }}
                  />
                </Tooltip>
              </>
            }
            name="seoKeywords"
          >
            <Input.TextArea className="mooween-input-lg" autoSize={{minRows: 2}} />
          </Form.Item>
          <Form.Item
            label={
              <>
                <span>SEO描述</span>
                <Tooltip title="合理的描述长度是155字符">
                  <InfoCircleFilled
                    style={{
                      marginTop: -2,
                      marginLeft: 4,
                      opacity: 0.5
                    }}
                  />
                </Tooltip>
              </>
            }
            name="seoDescription"
          >
            <Input.TextArea className="mooween-input-lg" autoSize={{minRows: 2}} />
          </Form.Item>
          <Form.Item
            label="企业邮局网址"
            name="email"
          >
            <Input size="large" />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default UserModal;
