import { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Drawer } from "antd";
import { useIntl } from "react-intl";

import AddressSelect from "../Basket/AddressSelect";
import { useSelector } from "react-redux";
import { API_URL } from "../../../../config";

import AuthService from "../../../util/services/authservice";
import axios from "axios";

const Defaut = () => {
  const intl = useIntl();
  const { isAuthenticated, user } = useSelector(({ login }) => login);
  const [fields, seTfields] = useState(
    Object.entries(user.address).map(([name, value]) => ({ name, value }))
  );
  const [address, seTaddress] = useState([]);
  const [newAddress, seTnewAddress] = useState({ open: false, id: null });
  const [city, seTcity] = useState([]);
  // const [country, seTcountry] = useState([]);
  const [selectedO, seTselectedO] = useState({});
  const [cityOption, seTcityOption] = useState([]);
  const [countryOption, seTcountryOption] = useState([]);
  const [ilceOption, seTilceOption] = useState([]);
  const [semtOption, seTsemtOption] = useState([]);
  const [mahalleOption, seTmahalleOption] = useState([]);

  function getDataFc() {
    if (user.id) {
      axios.get(`${API_URL}/customers/${user.id}`).then((res) => {
        const data = res.data;
        data["password"] = "";
        seTfields(
          Object.entries(data.address).map(([name, value]) => ({ name, value }))
        );
        seTaddress(data.address);
      });
    }
  }
  useEffect(() => {
    getDataFc();
  }, [user]);


  const getAddress = () => {
    if (isAuthenticated) {
      AuthService.isAuthenticated().then(async (auth) => {
        await seTaddress(auth.user.address);
      });
    }
  };

  const onSubmitAddress = async (Data) => {
    if (newAddress.id) {
      const newAddresArr = address.filter(
        (x) => JSON.stringify(x) !== newAddress.id
      );
      newAddresArr.push(Data);
      newAddresArr.reverse();

      if (isAuthenticated) {
        await axios
          .post(`${API_URL}/customerspublic/address`, newAddresArr)
          .then(() => {
            getAddress();
            seTnewAddress({ open: false, id: null });
          })
          .catch((err) => console.log("err", err));
      } else {
        message.success({ content: "Next Stage :)", duration: 3 });
        seTnewAddress({ open: false, id: null });
        seTaddress(newAddresArr);
      }
    } else {
      const newAddresArr = address;
      newAddresArr.push(Data);
      newAddresArr.reverse();

      axios
        .post(`${API_URL}/customerspublic/address`, newAddresArr)
        .then(() => {
          setTimeout(() => {
            getAddress();
            seTnewAddress({ open: false, id: null });
          }, 500);
        })
        .catch((err) => console.log("err", err));
    }
  };

  return (
    <div className="w-full">
      <Button
        className="float-left font-semibold text-sm w-full py-7 text-center h-auto   mb-5 "
        onClick={() => {
          seTfields(
            Object.entries(address[0] ? address[0] : {}).map(([name]) => ({
              name,
              value: null,
            }))
          );
          seTnewAddress({ ...newAddress, open: !newAddress.open });
        }}
      >
        New Address
      </Button>
      {address &&
        address.map((x, i) => (
          <AddressSelect
            key={i}
            Data={x}
            seTnewAddress={seTnewAddress}
            seTfields={seTfields}
            newAddress={newAddress}
          />
        ))}

      <Drawer
        title="Address"
        placement="right"
        onClose={() => {
          seTnewAddress({ ...newAddress, open: !newAddress.open });
        }}
        visible={newAddress.open}
      >
        <Form
          onFinish={onSubmitAddress}
          fields={fields}
          scrollToFirstError
          layout="vertical"
        >
          <Form.Item
            className="float-left  w-full mx-0 px-0"
            name="name"
            label={intl.messages["app.pages.customers.addressName"]}
            fieldKey="name"
            rules={[{ required: true, message: "Missing Area" }]}
          >
            <Input autocomplete="chrome-off" />
          </Form.Item>

          <Form.Item
            name="type"
            className="float-left  w-full  mx-0 px-0"
            label="Type"
            fieldKey="type"
          >
            <Select
              defaultValue={true}
              options={[
                { label: "Billing Address", value: true },
                { label: "Shipping Address", value: false },
              ]}
              placeholder="Select Address Type"
              autoComplete="none"
            />
          </Form.Item>

          <Form.Item
            name="country_id"
            className="float-left  w-full  mx-0 px-0"
            label="Country"
            fieldKey="country_id"
          >
            <Input
                           placeholder={
                              intl.messages["app.pages.customers.addressDistrict"]
                           }
                           autoComplete="none"
                        />
          </Form.Item>

          <Form.Item
            className="float-left w-full  mx-0 px-0"
            name="city_id"
            fieldKey="city_id"
            label="City"
            rules={[{ required: true, message: "Missing Area" }]}
          >
              <Input
                placeholder={intl.messages["app.pages.customers.addressTown"]}
                autocomplete="chrome-off"
              />
          </Form.Item>

          <Form.Item
            className="float-left w-full  mx-0 px-0"
            name="town_id"
            label="Town"
            fieldKey="town_id"
            rules={[{ required: true, message: "Missing Area" }]}
          >
             <Input
                placeholder={intl.messages["app.pages.customers.addressTown"]}
                autocomplete="chrome-off"
              />
          </Form.Item>

          <Form.Item
            className="float-left w-full  mx-0 px-0"
            name="district_id"
            label="District"
            fieldKey="district_id"
            rules={[{ required: true, message: "Missing Area" }]}
          >
            <Input
                placeholder={
                  intl.messages["app.pages.customers.addressDistrict"]
                }
                autocomplete="chrome-off"
              />
          </Form.Item>

          <Form.Item
            name="village_id"
            className="float-left w-full  mx-0 px-0"
            label="Village"
            fieldKey="village_id"
            rules={[{ required: true, message: "Missing Area" }]}
          >
            <Input
                placeholder={
                  intl.messages["app.pages.customers.addressNeighbour"]
                }
                autocomplete="chrome-off"
              />
          </Form.Item>
          <Form.Item
            className="float-left w-full  mx-0 px-0"
            name="address"
            label="Address"
            fieldKey="address"
            rules={[{ required: true, message: "Missing Area" }]}
          >
            <Input.TextArea
              rows={3}
              placeholder={intl.messages["app.pages.customers.addressFull"]}
              autocomplete="chrome-off"
            />
          </Form.Item>
          <Button htmlType="submit" className="w-full p-3 h-auto">
            Save
          </Button>
        </Form>
      </Drawer>
    </div>
  );
};

export default Defaut;
