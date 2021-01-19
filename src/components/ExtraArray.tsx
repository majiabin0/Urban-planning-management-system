import React from "react";
import { Form, Button } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  UpCircleOutlined,
  DownCircleOutlined
} from "@ant-design/icons";
import Extra from "@/components/Extra";

const ExtraArray: React.FC<{
  options: {
    name: String;
    field: String;
    itemOptions: any[];
    max?: Number;
  };
}> = ({ options }) => {
  return (
    <Form.List name={String(options.field)}>
      {(fields, { add, remove, move }) => {
        return (
          <div>
            {fields.map((field, index) => {
              return (
                <div
                  key={field.key}
                  style={{
                    border: "1px solid #ddd",
                    padding: "24px 24px 0",
                    margin: "0 0 24px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 20px rgba(0, 0, 0, .08)"
                  }}
                >
                  {options.itemOptions && Array.isArray(options.itemOptions)
                    ? options.itemOptions.map((option, i) => (
                        <Form.Item
                          key={i}
                          label={option.name}
                          name={[index, option.field]}
                          rules={[{ required: option.required }]}
                        >
                          <Extra options={option} />
                        </Form.Item>
                      ))
                    : null}
                  <Form.Item>
                    <Button
                      // @ts-ignore
                      type="danger"
                      onClick={() => remove(field.name)}
                      icon={<MinusCircleOutlined />}
                    >
                      移除{options.name}
                    </Button>
                    {index > 0 ? (
                      <Button
                        style={{ marginLeft: "8px" }}
                        icon={<UpCircleOutlined />}
                        onClick={() => {
                          move(index, index - 1);
                        }}
                      >
                        上移
                      </Button>
                    ) : null}
                    {index < fields.length - 1 ? (
                      <Button
                        style={{ marginLeft: "8px" }}
                        icon={<DownCircleOutlined />}
                        onClick={() => {
                          move(index, index + 1);
                        }}
                      >
                        下移
                      </Button>
                    ) : null}
                  </Form.Item>
                </div>
              );
            })}
            {options.max && fields.length >= options.max ? null : (
              <Form.Item>
                <Button type="dashed" onClick={() => add()}>
                  <PlusOutlined /> 添加{options.name}
                </Button>
              </Form.Item>
            )}
          </div>
        );
      }}
    </Form.List>
  );
};

export default ExtraArray;
