import { useState } from "react";
import { Input, Form, Button, Select, Divider } from "antd";
import { useIntl } from "react-intl";

import IntlMessages from "../../../util/IntlMessages";

const Default = ({ onSubmitSignup }) => {
  const intl = useIntl();
  const [form] = Form.useForm();
  const [state, seTstate] = useState();
  const changePrefix = (selected) => {
    seTstate({
      ...state,
      prefix: selected,
    });
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle initialValue={"84"}>
      <Select onChange={changePrefix} style={{ width: 70 }}>
        <Select.Option value="84">+84</Select.Option>
      </Select>
    </Form.Item>
  );

  return (
    <>
      <Form onFinish={onSubmitSignup} layout="vertical" form={form}>
        <Form.Item
          className="mb-4"
          name="username"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: intl.messages["app.pages.common.inputNotValid"],
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label={intl.messages["app.pages.common.password"]}
          rules={[
            {
              message: intl.messages["app.pages.common.inputNotValid"],
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirm"
          label={intl.messages["app.pages.common.confirmPassword"]}
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              message: intl.messages["app.pages.common.inputNotValid"],
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  intl.messages["app.pages.common.passwordNotMatch"]
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          className="mb-4"
          name="name"
          label={intl.messages["app.pages.customers.name"]}
          rules={[
            {
              required: true,
              message: intl.messages["app.pages.common.pleaseFill"],
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          className="mb-4"
          name="surname"
          label={intl.messages["app.pages.customers.surname"]}
          rules={[
            {
              required: true,
              message: intl.messages["app.pages.common.pleaseFill"],
              whitespace: true,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label={intl.messages["app.pages.customers.phone"]}
          rules={[
            {
              required: true,
              message: intl.messages["app.pages.common.pleaseFill"],
            },
          ]}
        >
          <Input addonBefore={prefixSelector} />
        </Form.Item>

        <Divider />
        <Form.Item>
          <Button
            type="primary"
            className="w-full text-orange-500 font-semibold"
            htmlType="submit"
          >
            <IntlMessages id="app.pages.common.save" />
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default Default;
