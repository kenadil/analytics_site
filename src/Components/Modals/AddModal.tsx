import { Button } from "antd";
import Modal from "antd/lib/modal/Modal";
import { Formik } from "formik";
import {
  ResetButton,
  SubmitButton,
  Form,
  Input,
  AutoComplete,
} from "formik-antd";
import { OptionsType } from "rc-select/lib/interface";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import RecordSchema from "../../Services/validation";
import { RecordType, stateType } from "../Users/Table";

export type AddModalPropTypes = {
  title: any;
  onSave: (values: RecordType) => void;
  record: undefined | RecordType;
  icon: undefined | React.ReactNode;
};

const AddModal = ({ title, onSave, icon, record }: AddModalPropTypes) => {
  const [state, setState] = useState({
    ModalText: "",
    visible: false,
    confirmLoading: false,
  });
  const advisers = ['N/A'];
  const advisersList = useSelector((state: stateType) => state.categoriesState);
  advisersList?.map((e) => advisers.push(e.name));
  const options: OptionsType | { value: string; }[] | undefined = [];
  advisers.map((e) => options.push({ value: e }));
  const records = useSelector((state: stateType) => state.recordState);
  const [lastId, setLastId] = useState(0);
  useEffect(() => {
    setLastId(
      record
        ? record.id
        :records[records.length - 1]?.id + 1
    );
  }, [records]);

  const [autoCompleteVal, setAutoCompleteVal] = useState(record ? advisersList.find(e => e.id === record.category)?.name : "N/A");

  const showModal = () => {
    setState((prevState) => ({ ...prevState, visible: true }));
  };

  const handleOk = (values: any) => {
    setState((prevState) => ({
      ...prevState,
      ModalText: "Loading. Please, wait",
      confirmLoading: true,
    }));
    onSave(values);
    setState((prevState) => ({
      ModalText: "",
      visible: false,
      confirmLoading: false,
    }));
  };

  const handleCancel = () => {
    setState((prevState) => ({
      ...prevState,
      visible: false,
    }));
  };

  const d = new Date();

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <>
      {record === undefined ? (
        <Button
          style={{ float: "right", transform: "translate(0%, 25%)" }}
          onClick={() => showModal()}
          className="purple-button"
        >
          Add User
        </Button>
      ) : (
        <a onClick={() => showModal()}>Edit</a>
      )}
      <Modal
        title={title}
        visible={state.visible}
        confirmLoading={state.confirmLoading}
        onCancel={() => handleCancel()}
        footer={[<Button></Button>]}
      >
        <Formik
          initialValues={
            record
              ? 
              record
              : {
                  id: undefined,
                  email: undefined,
                  name: undefined,
                  date:
                    monthNames[d.getMonth()] +
                    " " +
                    d.getDate() +
                    ", " +
                    d.getFullYear(),
                  category: null,
                }
          }
          validationSchema={RecordSchema}
          onSubmit={(values, { resetForm }) => {
            if (!record) 
              values.id = (lastId);
            values.category = autoCompleteVal === "N/A" ? null : advisersList.find(e => e.name === autoCompleteVal)?.id;
            setAutoCompleteVal("N/A");
            console.log(JSON.stringify(values));
            handleOk(values);
            resetForm({});
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Form.Item name="id">
                <span style={{ marginLeft: "0.25vh" }}>ID</span>
                <Input
                  disabled
                  style={{ marginTop: "1vh" }}
                  name="id"
                  placeholder="ID"
                  value={record ? record.id : lastId}
                />
              </Form.Item>
              <Form.Item name="name">
                <span style={{ marginLeft: "0.25vh" }}>Full name</span>
                <Input
                  style={{ marginTop: "1vh" }}
                  name="name"
                  placeholder="Full name"
                />
              </Form.Item>
              <Form.Item name="email">
                <span style={{ marginLeft: "0.25vh" }}>E-mail</span>
                <Input
                  style={{ marginTop: "1vh" }}
                  name="email"
                  placeholder="E-mail"
                />
              </Form.Item>
              <Form.Item name="category">
                <span style={{ marginLeft: "0.25vh" }}>Course</span>
                <AutoComplete
                  name="category"
                  placeholder="N/A"
                  options={options}
                  showArrow={true}
                  value={autoCompleteVal === "N/A" ? "" : autoCompleteVal}
                  onChange={(e) => {
                    setAutoCompleteVal(e);
                  }}
                  filterOption={(inputValue, option) => 
                    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  allowClear
                />
              </Form.Item>
              <div style={{ transform: "translate(72.5%)" }}>
                <SubmitButton style={{ marginRight: "1%" }}>Save</SubmitButton>
                <ResetButton>Reset</ResetButton>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
};

export default AddModal;
