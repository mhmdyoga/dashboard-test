'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { deleteProduct, getProducts, updateProduct } from '@/libs/hooks/hookProduct';
import { Table, Spin, Alert, Tooltip, Button, Drawer, Form, Input, Row, Col } from 'antd';
import ProductNew from '../ui/addProductButton';
import { useForm } from 'antd/es/form/Form';

type ProductsType = {
  id?: string;
  title: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

const Dashboard = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  }); // fetch data from API

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    description: '',
    image: '',
  });
  const [form] = useForm();
  const [selectedProductId, setSelectedProductId] = useState(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const showDrawer = (record: any) => {
    setSelectedProductId(record.id);
    form.setFieldsValue({
      title: record.title,
      price: record.price,
      category: record.category,
      description: record.description,
      image: record.image,
    });
    setOpen(true);
  }; // show drawer with product data

  const onClose = () => {
    setOpen(false);
    setSelectedProductId(null);
  }; // close drawer

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }; // handle form change edit form

  const handleUpdate = async () => {
    try {
      if (selectedProductId === null) {
        throw new Error("No product selected for update");
      }
      const updatedData = await form.validateFields();
      await updateProduct(selectedProductId, updatedData);
      form.resetFields();
      setOpen(false);
    } catch (error) {
      console.log("Validation failed:", error);
    }
  }; // handle submit from edit

  if (isLoading) {
    return <Spin spinning={isLoading} />;
  }// loading if data is loading

  if (isError) {
    return (
      <Alert message="Error" description={error.message} type="error" showIcon />
    );
  };// error if data is error

  const dataProduct = data.map((item: ProductsType) => ({
    key: item.id,
    id: item.id,
    title: item.title,
    price: item.price,
    description: item.description,
    category: item.category,
    image: item.image,
  })); // fetch data from api

  if (!dataProduct || dataProduct.length === 0) {
    return (
      <Alert message="Product not Found" description="please add your new product" type="error" showIcon />
    );
  }; // logic if data is empty

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          <span>{text}</span>
        </Tooltip>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
    },
    {
      title: 'Action',
      key: 'action',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      render: (_: any, record: any) => (
        <div className="flex flex-row gap-2 space-x-2">
          <button onClick={() => showDrawer(record)}>Edit</button>
          <button onClick={() => deleteProduct(record.id)}>Delete</button>
        </div>
      ),
    },
  ]; // columns for table

  return (
    <div>
      <div className="p-6 ml-[1050px]">
        <ProductNew />
      </div>
      <Table dataSource={dataProduct} columns={columns} />

      <Drawer
        title="Edit Product"
        width={720}
        onClose={onClose}
        open={open}
        footer={
          <div>
            <Button onClick={onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} type="primary">
              Update
            </Button>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          name="productForm"
          initialValues={formData}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please input the product title!' }]}
              >
                <Input name='title' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please input the product price!' }]}
              >
                <Input name='price' onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Input name='category' onChange={handleChange} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="image"
                label="Image URL"
                rules={[{ required: true, message: 'Please input the image URL!' }]}
              >
                <Input name='image' onChange={handleChange} />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please input the product description!' }]}
          >
            <Input.TextArea name='description' onChange={handleChange} />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default Dashboard;
