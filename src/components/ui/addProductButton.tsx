"use client";
import React, { useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Drawer, Form, Input, Row, Select} from 'antd';
import { createProduct } from '@/libs/hooks/hookProduct';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product } from '@/libs/type';
import { useForm } from 'antd/es/form/Form';

const { Option } = Select;

const ProductNew = () => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        category: '',
        description: '',
        image: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      e.preventDefault();
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      })
    };

    const [form] = useForm();

  const queryClient = useQueryClient(); // untuk mengakses data di cache

    const handleSelectChange = (value: string) => {
        setFormData({
            ...formData,
            category: value,
            });
    };
    const mutation = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] }); // untuk mengupdate data di cache
            setOpen(false);
            form.resetFields()
            return (
              <Alert message="Success upload product" description="Product has been created" type='success' showIcon/>
            )
        },        onError: (error) => {
                  return(
                    <Alert message="Error upload product" description={error.message} type='error' showIcon/>
                  )
            },
    })

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      const productData: Partial<Product> = {
        title: formData.title,
        price: formData.price,
        category: formData.category,
        description: formData.description,
        image: formData.image
      };
      mutation.mutate(productData as Product);
    }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
        New Product
      </Button>
      <Drawer
        title="Create a new product"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
      >
        <Form layout="vertical" hideRequiredMark form={form} onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Title"
                rules={[{ required: true, message: 'Please enter your product title' }]}
              >
                <Input type="text" name="title" onChange={handleChange} placeholder="Please enter the title product" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="image"
                label="Image Url"
                rules={[{ required: true, message: 'Please enter your image url' }]}
              >
                <Input
                  style={{ width: '100%' }}
                  addonBefore="https://"
                  addonAfter=".com"
                  placeholder="Please enter your imageurl"
                  type="text"
                  name="image"
                  onChange={handleChange}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="price"
                label="Price"
                rules={[{ required: true, message: 'Please required the price' }]}
              >

                <Input placeholder="Please enter price of product" type='number' name="price" onChange={handleChange}/>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please choose the category' }]}
              >
                <Select placeholder="Please choose the category" onChange={handleSelectChange}>
                  <Option value="fashions">Fashions</Option>
                  <Option value="foods">Foods</Option>
                  <Option value="drinks">Drinks</Option>
                  <Option value="snack">Snack</Option>
                  <Option value="accessories">Accessories</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'please enter your product description',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="please enter product description" name="description" onChange={handleChange}/>
              </Form.Item>
            </Col>
          </Row>
          <div className='flex md:flex-row flex-col'>
           <button type='submit' className='bg-black text-white font-bold p-4 flex justify-center items-center' disabled={mutation.isPending}>
            {mutation.isPending ? 'uploading....' : 'add product'}
          </button>
          <button onClick={onClose} className='ml-4 bg-red p-2 flex justify-center items-center'>Cancel</button>
          </div>
          {mutation.isError && <Alert message="Error upload product" description={mutation.error.message} type='error' showIcon/>}
        </Form>
      </Drawer>
    </>
  )
}
export default ProductNew