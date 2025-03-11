import "../css/category.css";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import { GetCategoryInfoApi } from "../API Calls/Category/GetCategoryInfo.jsx";
import {
  Modal,
  Button,
  Table,
  Input,
  Form,
  Space,
  Upload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function Category() {
  const [cookies] = useCookies();
  const [category, setCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null); // to store the image URL for the dish

  useEffect(() => {
    const getCategories = async () => {
      const response = await GetCategoryInfoApi(cookies.jwt);
      if (response) {
        setCategory(response.data.data);
      }
    };
    getCategories();
  }, [cookies.jwt]);

  const showFoodDetails = (food) => {
    setSelectedFood(food);
    setIsViewModalOpen(true);
  };

  const handleViewModalClose = () => {
    setIsViewModalOpen(false);
    setSelectedFood(null);
  };

  const showEditModal = (food) => {
    setSelectedFood(food);
    form.setFieldsValue({
      name: food.name,
      price: food.price,
      description: food.description,
      ingredients: food.ingredients.map((ingredient) => ingredient.name),
    });
    setImageUrl(food.image_url);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedFood(null);
    window.location.reload();
  };

  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setImageUrl(null);
  };

  const handleEditSubmit = (values) => {
    console.log("Updated Food:", { ...selectedFood, ...values });
    handleEditModalClose();
  };

  const handleCreateSubmit = (values) => {
    console.log("Created Food:", { ...values, imageUrl });
    handleCreateModalClose();
  };

  const handleDelete = (foodId) => {
    console.log("Delete food with ID:", foodId);
    // Implement delete logic here
  };

  const handleAddIngredient = () => {
    const ingredients = form.getFieldValue("ingredients") || [];
    form.setFieldsValue({ ingredients: [...ingredients, ""] });
  };

  const handleRemoveIngredient = (index) => {
    const ingredients = form.getFieldValue("ingredients");
    if (ingredients.length > 1) {
      ingredients.splice(index, 1);
      form.setFieldsValue({ ingredients: [...ingredients] });
    }
  };

  const handleImageUpload = ({ file }) => {
    if (file.status === "done") {
      setImageUrl(file.response?.url); // Assume the response contains the image URL
    } else if (file.status === "error") {
      message.error("Image upload failed.");
    }
    return false; // Prevent automatic upload by Ant Design's Upload component
  };

  const columns = [
    {
      title: "Dish Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price (LE)",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => showFoodDetails(record)}
            style={{ marginRight: 8 }}
          >
            View
          </Button>
          <Button
            onClick={() => showEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button
            onClick={() => handleDelete(record.id)}
            danger
            type={"primary"}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="CategoryPage">
      <div className="PageTitle">
        <h1>Your Menu</h1>
      </div>

      {category ? (
        <div className="CategoryContainer">
          <div className={"Header"}>
            <h2>{category.title}</h2>
            <Button
              type="primary"
              onClick={handleCreateModalOpen}
              className="CreateButton"
            >
              Create Dish
            </Button>
          </div>
          <Table dataSource={category.foods} columns={columns} rowKey="id" />
        </div>
      ) : (
        <p>Loading category...</p>
      )}

      {/* Create Food Modal */}
      <Modal
        open={isCreateModalOpen}
        onCancel={handleCreateModalClose}
        footer={null}
      >
        <h2>Create New Dish</h2>
        <Form form={form} onFinish={handleCreateSubmit} layout="vertical">
          <Form.Item
            label="Dish Name"
            name="name"
            rules={[{ required: true, message: "Dish name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price (LE)"
            name="price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item label="Dish Image">
            <Upload
              action="/upload" // Change this to the correct upload URL
              listType="picture-card"
              showUploadList={false}
              customRequest={handleImageUpload}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Dish"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div>Upload Image</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="Ingredients">
            <Form.List name="ingredients">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          { required: true, message: "Ingredient required" },
                        ]}
                      >
                        <Input placeholder="Ingredient name" />
                      </Form.Item>
                      <Button
                        type={"primary"}
                        danger
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        Remove
                      </Button>
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={handleAddIngredient}
                    style={{ marginTop: 10 }}
                  >
                    + Add Ingredient
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Save Dish
            </Button>
            <Button onClick={handleCreateModalClose}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Food Details Modal */}
      <Modal
        open={isViewModalOpen}
        onCancel={handleViewModalClose}
        footer={null}
      >
        {selectedFood && (
          <div className="FoodDetails">
            <h2>{selectedFood.name}</h2>
            <img
              src={selectedFood.image_url}
              alt={selectedFood.name}
              style={{
                width: "100%",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            <h3>Ingredients:</h3>
            <ul>
              {selectedFood.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient.name}</li>
              ))}
            </ul>
          </div>
        )}
      </Modal>

      {/* Edit Food Modal */}
      <Modal
        open={isEditModalOpen}
        onCancel={handleEditModalClose}
        footer={null}
      >
        <h2>Edit Food</h2>
        <Form form={form} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item
            label="Dish Name"
            name="name"
            rules={[{ required: true, message: "Dish name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price (LE)"
            name="price"
            rules={[{ required: true, message: "Price is required" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea
              name="description"
              value={selectedFood?.description}
            />
          </Form.Item>
          <Form.Item label="Dish Image">
            <Upload
              action="/upload" // Change this to the correct upload URL
              listType="picture-card"
              showUploadList={false}
              customRequest={handleImageUpload}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Dish"
                  style={{
                    width: "100%",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div>
                  <UploadOutlined />
                  <div>Upload Image</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          <Form.Item label="Ingredients">
            <Form.List name="ingredients">
              {(fields, { add, remove }) => (
                <div>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Space
                      key={key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="baseline"
                    >
                      <Form.Item
                        {...restField}
                        name={name}
                        rules={[
                          { required: true, message: "Ingredient required" },
                        ]}
                      >
                        <Input placeholder="Ingredient name" />
                      </Form.Item>
                      <Button
                        type={"primary"}
                        danger
                        onClick={() => handleRemoveIngredient(index)}
                      >
                        Remove
                      </Button>
                    </Space>
                  ))}
                  <Button
                    type="dashed"
                    onClick={handleAddIngredient}
                    style={{ marginTop: 10 }}
                  >
                    + Add Ingredient
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
              Save Changes
            </Button>
            <Button onClick={handleEditModalClose}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
