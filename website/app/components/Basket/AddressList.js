import axios from "axios";
import { useState, useEffect } from "react";
import { message, Button, Input, Select, Checkbox, Form, Drawer } from "antd";
import AddressSelect from "./AddressSelect";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../../../config";
import { getBasket_r, updateBasket_r } from "../../../redux/actions";
import { useIntl } from "react-intl";
import AuthService from "../../../util/services/authservice";

const Default = () => {
   const intl = useIntl();

   const { basket } = useSelector((state) => state.basket);
   const { isAuthenticated, user } = useSelector(({ login }) => login);
   const [fields, seTfields] = useState([]);

   const [address, seTaddress] = useState([]);

   const [selectedShippingAddress, seTselectedShippingAddress] = useState(null);
   const [selectedBillingAddress, seTselectedBillingAddress] = useState(null);
   const [billingAdressSame, seTbillingAdressSame] = useState(true);
   const [newAddress, seTnewAddress] = useState({ open: false, id: null });


   const [form] = Form.useForm();

   const dispatch = useDispatch();

   const updateAddress = async (newAddresArr) => {
      if (isAuthenticated) {
         await axios
            .post(`${API_URL}/customerspublic/address`, newAddresArr)
            .then(() => {
               setTimeout(() => {
                  getAddress();
                  seTnewAddress({ open: false, id: null });
               }, 500);
            })
            .catch((err) => console.log("err", err));
      } else {
         message.success({ content: "Next Stage :)", duration: 3 });
         seTnewAddress({ open: false, id: null });
         seTaddress(newAddresArr);
      }
   };

   const updateBasket = async (post) => {
      if (isAuthenticated) {
         axios.post(`${API_URL}/basket/${basket[0]._id}`, post)
            .then(async () => {
               message.success({
                  content: "Address Selected",
                  duration: 3,
               });
               await dispatch(getBasket_r(user.id));
            })
            .catch((err) => {
               message.error({
                  content: "Some Error, Please Try Again",
                  duration: 3,
               });
               console.log(err);
            });
      } else {
         message.success({ content: "Next Stage :)", duration: 3 });
         dispatch(updateBasket_r([post]));
      }
   };

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

         updateAddress(newAddresArr);

      } else {
         const newAddresArr = address;
         newAddresArr.push(Data);
         newAddresArr.reverse();

         updateAddress(newAddresArr);
      }
   };

   const onFinishFailedAddress = (errorInfo) => {
      console.log(errorInfo);
   };

   const getSelectedAddress = () => {
      if (basket.length > 0) {

         if (basket[0].shipping_address) {
            seTselectedShippingAddress(JSON.stringify(basket[0].shipping_address));
         }

         if (basket[0].billing_address) {
            seTselectedBillingAddress(JSON.stringify(basket[0].billing_address));
         }

         const stringifBillingAddres = JSON.stringify(basket[0].billing_address);
         const stringifShippingAddres = JSON.stringify(basket[0].shipping_address);

         if (stringifBillingAddres != stringifShippingAddres) {
            seTbillingAdressSame(false);
         }

      }
   };

   useEffect(() => {
      // getCountry();
      getAddress();
      getSelectedAddress();
   }, [basket[0]]);

   const onChanheShppingAddress = (data) => {

      if (billingAdressSame) {
         seTselectedShippingAddress(data);
         seTselectedBillingAddress(data);

         const newBasketPost = {
            created_user: {
               name: user.name,
               id: user.id,
            },
            customer_id: user.id,
            products: basket[0].products,
            cargoes_id: basket[0].cargoes_id,
            total_price: basket[0].total_price,
            total_discount: basket[0].total_discount,
            cargo_price: basket[0].cargo_price,
            cargo_price_discount: basket[0].cargo_price_discount,
            shipping_address: JSON.parse(data),
            billing_address: JSON.parse(data),
         };

         updateBasket(newBasketPost);

      } else {
         seTselectedShippingAddress(data);
         const newBasketPost = {
            created_user: {
               name: user.name,
               id: user.id,
            },
            customer_id: user.id,
            products: basket[0].products,
            cargoes_id: basket[0].cargoes_id,
            total_price: basket[0].total_price,
            total_discount: basket[0].total_discount,
            cargo_price: basket[0].cargo_price,
            cargo_price_discount: basket[0].cargo_price_discount,
            shipping_address: JSON.parse(data),
         };

         updateBasket(newBasketPost);

      }
   };

   const onChanheBillingAddress = (data) => {
      seTselectedBillingAddress(data);

      const newBasketPost = {
         created_user: {
            name: user.name,
            id: user.id,
         },
         customer_id: user.id,
         products: basket[0].products,
         cargoes_id: basket[0].cargoes_id,
         total_price: basket[0].total_price,
         total_discount: basket[0].total_discount,
         cargo_price: basket[0].cargo_price,
         cargo_price_discount: basket[0].cargo_price_discount,
         shipping_address: JSON.parse(selectedShippingAddress),
         billing_address: JSON.parse(data),
      };
      updateBasket(newBasketPost);
   };
   return (
      <>
         <div className="w-full  px-4 pb-10 grid grid-cols-12 gap-x-5">
            <Button
               className="float-left col-span-12 font-semibold text-sm w-full py-7 text-center h-full mb-5 "
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

            <div className="col-span-12 float-left mt-10 -mb-16 z-10  text-right">
               <Checkbox
                  className=" w-auto float-right "
                  onChange={(vall) => {
                     seTbillingAdressSame(!billingAdressSame);
                     if (vall.target.checked) {
                        onChanheBillingAddress(selectedShippingAddress);
                        seTselectedBillingAddress(selectedShippingAddress);
                     }
                  }}
                  checked={billingAdressSame}
               >
            Billing address is same
               </Checkbox>
            </div>
            <div
               className={
                  billingAdressSame ? "col-span-12" : "col-span-12 sm:col-span-6"
               }
            >
               <div className="text-lg  font-semibold w-full sm:mt-10 mt-16">
            Shipping Address
               </div>

               <div className="w-full ">
                  {address &&
              address.map((x, i) => (
                 <AddressSelect
                    key={i}
                    Data={x}
                    seTnewAddress={seTnewAddress}
                    seTfields={seTfields}
                    newAddress={newAddress}
                    selectedShippingAddress={selectedShippingAddress}
                    onChanheShppingAddress={onChanheShppingAddress}
                 />
              ))}
               </div>
            </div>
            <div
               className={billingAdressSame ? "hidden" : "col-span-12 sm:col-span-6"}
            >
               <div className="text-lg font-semibold w-full   sm:mt-10 mt-16">
            Billing Address{" "}
               </div>
               <div className="w-full">
                  {address &&
              address.map((x, i) => (
                 <AddressSelect
                    key={i}
                    Data={x}
                    seTnewAddress={seTnewAddress}
                    seTfields={seTfields}
                    newAddress={newAddress}
                    selectedBillingAddress={selectedBillingAddress}
                    onChanheBillingAddress={onChanheBillingAddress}
                 />
              ))}
               </div>
            </div>

            <Drawer
               title="Address"
               placement="left"
               onClose={() => {
                  seTnewAddress({ ...newAddress, open: !newAddress.open });
               }}
               visible={newAddress.open}
            >
               <Form
                  form={form}
                  onFinishFailed={onFinishFailedAddress}
                  onFinish={onSubmitAddress}
                  fields={fields}
                  scrollToFirstError
               >
                  <Form.Item
                     className="float-left  w-full mx-0 px-0"
                     name="name"
                     fieldKey="name"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                     <Input
                        placeholder={intl.messages["app.pages.customers.addressName"]}
                        autocomplete="chrome-off"
                     />
                  </Form.Item>

                  <Form.Item
                     name="type"
                     className="float-left w-full mx-0 px-0"
                     fieldKey="type"
                  >
                     <Select
                        defaultValue={true}
                        options={[
                           { label: "Billing Address", value: true },
                           { label: "Shipping Address", value: false },
                        ]}
                        placeholder="Select Address Type"
                     />
                  </Form.Item>

                  <Form.Item
                     name="country_id"
                     className="float-left w-full mx-0 px-0"
                     fieldKey="country_id"
                  >
                     <Input
                           placeholder={
                              intl.messages["app.pages.customers.addressNeighbour"]
                           }
                        />
                  </Form.Item>

                  <Form.Item
                     className="float-left w-full  mx-0 px-0"
                     name="city_id"
                     fieldKey="city_id"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                       <Input
                           placeholder={
                              intl.messages["app.pages.customers.addressNeighbour"]
                           }
                        />
                  </Form.Item>

                  <Form.Item
                     className="float-left w-full  mx-0 px-0"
                     name="town_id"
                     fieldKey="town_id"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                      <Input
                           placeholder={intl.messages["app.pages.customers.addressTown"]}
                           autoComplete="none"
                        />
                  </Form.Item>

                  <Form.Item
                     className="float-left w-full  mx-0 px-0"
                     name="district_id"
                     fieldKey="district_id"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                   <Input
                           placeholder={intl.messages["app.pages.customers.addressTown"]}
                           autoComplete="none"
                        />
                  </Form.Item>

                  <Form.Item
                     name="village_id"
                     className="float-left w-full mx-0 px-0"
                     fieldKey="village_id"
                     autoComplete="none"
                     rules={[{ required: true, message: "Missing Area" }]}
                  >
                    <Input
                           placeholder={
                              intl.messages["app.pages.customers.addressNeighbour"]
                           }
                        />
                  </Form.Item>
                  <Form.Item
                     className="float-left w-full  mx-0 px-0"
                     name="address"
                     fieldKey="address"
                     rules={[{ required: true, message: "Missing Area" }]}
                     autoComplete="none"
                  >
                     <Input.TextArea
                        rows={3}
                        placeholder={intl.messages["app.pages.customers.addressFull"]}
                     />
                  </Form.Item>
                  <Button htmlType="submit" className="w-full p-3 h-auto">
              Save
                  </Button>
               </Form>
            </Drawer>
         </div>
      </>
   );
};

export default Default;
