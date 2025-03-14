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
import { UpdateFoodApi } from "../API Calls/Category/UpdateFood.jsx";
import { CreateFoodApi } from "../API Calls/Category/CreateFood.jsx";
import { DeleteFoodApi } from "../API Calls/Category/DeleteFood.jsx";

export default function Category() {
  const [cookies] = useCookies();
  const [category, setCategory] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState(null); // to store the image URL for the dish
  const handleFileChange = ({ fileList: newFileList }) => {
    if (newFileList.length > 0) {
      const newImageUrl = URL.createObjectURL(newFileList[0].originFileObj);
      setImageUrl(newImageUrl);
    }

    setFileList(newFileList);
  };
  const beforeUpload = (file) => {
    const isImage = file.type === "image/jpeg" || file.type === "image/png";
    const isLt3M = file.size / 1024 / 1024 < 3;

    if (!isImage) {
      message.error("You can only upload JPG/PNG files!");
    }
    if (!isLt3M) {
      message.error("File must be smaller than 3MB!");
    }

    return isImage && isLt3M;
  };
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
      image: food.image_url,
      ingredients: food.ingredients.map((ingredient) => ingredient.name),
    });
    setImageUrl(food.image_url);
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedFood(null);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
    setImageUrl(null);
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };
  const handleEditSubmit = async (values) => {
    const formData = new FormData();
    formData.append("food[name]", values.name);
    formData.append("food[price]", values.price);
    formData.append("food[description]", values.description);

    // Ensure ingredients are passed as an array
    if (Array.isArray(values.ingredients)) {
      values.ingredients.forEach((ingredient, index) => {
        formData.append(`food[ingredients][]`, ingredient);
      });
    } else {
      formData.append("food[ingredients]", values.ingredients);
    }

    if (fileList.length > 0) {
      formData.append("food[image]", fileList[0].originFileObj);
    } else {
      formData.append("food[image_url]", values.image_url);
    }

    const response = await UpdateFoodApi(
      cookies.jwt,
      selectedFood.id,
      formData,
    );

    if (response) {
      console.log("Food updated successfully");
      message.success("Food updated successfully");
    } else {
      message.error("Failed to update food");
    }

    handleEditModalClose();
  };

  const handleCreateSubmit = async (values) => {
    const formData = new FormData();
    formData.append("food[name]", values.name);
    formData.append("food[price]", values.price);
    formData.append("food[description]", values.description);

    // Append ingredients properly
    values.ingredients.forEach((ingredient) => {
      formData.append("food[ingredients][]", ingredient);
    });
    if (fileList.length > 0) {
      formData.append("food[image]", fileList[0].originFileObj);
    }

    const response = await CreateFoodApi(cookies.jwt, formData);
    if (response) {
      console.log("Food created successfully");
      message.success("Food created successfully");
    } else {
      message.error("Failed to create food");
    }

    // Close modal after submission
    handleCreateModalClose();
  };

  const handleDelete = async (foodId) => {
    console.log("Delete food with ID:", foodId);
    const response = await DeleteFoodApi(cookies.jwt, foodId);
    if (response) {
      console.log("Food deleted successfully");
      message.success("Food deleted successfully");
    } else {
      message.error("Failed to delete food");
    }
    setTimeout(() => {
      window.location.reload();
    }, 500);
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

  // const handleImageUpload = async ({ file }) => {
  //   if (file.status === "done") {
  //     setImageUrl(file.response?.image_url); // Get the image URL from the backend response
  //   } else if (file.status === "error") {
  //     message.error("Image upload failed.");
  //   }
  //   return false; // Prevent automatic upload by Ant Design's Upload component
  // };

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
          <button
            className={"ViewButton"}
            onClick={() => showFoodDetails(record)}
            style={{ marginRight: 8 }}
          >
            View
          </button>
          <button
            className={"EditButton"}
            onClick={() => showEditModal(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </button>
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
              fileList={fileList}
              onChange={handleFileChange}
              // beforeUpload={beforeUpload}
              maxCount={1}
              accept=".jpg,.jpeg,.png"
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
                      style={{
                        display: "flex",
                        marginBottom: 8,
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
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
            <Button
              type="primary"
              htmlType="submit"
              style={{ marginRight: 8 }}
              // onClick={handleCreateSubmit}
            >
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
                objectFit: "cover",
                borderRadius: "10px",
                marginBottom: "10px",
              }}
            />
            <h3>Ingredients:</h3>
            <ul className={"IngredientsList"}>
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
            name="description"
            rules={[{ required: true, message: "Description is required" }]}
          >
            <Input.TextArea
              name="description"
              value={
                form.getFieldValue("description") || selectedFood?.description
              }
              onChange={(e) =>
                form.setFieldsValue({ description: e.target.value })
              }
            />
          </Form.Item>
          <Form.Item label="Dish Image">
            <Upload
              fileList={fileList}
              onChange={handleFileChange}
              beforeUpload={beforeUpload}
              maxCount={1}
              accept=".jpg,.jpeg,.png"
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
                  {fields.map(({ key, name, index, ...restField }) => (
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
                        onClick={() => handleRemoveIngredient(key)}
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
