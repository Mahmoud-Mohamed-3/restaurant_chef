import { useEffect, useState } from "react";
import "../css/info_page.css";

export default function ChefInfo() {
  const [chef, setChef] = useState(null);

  useEffect(() => {
    const storedChef = JSON.parse(sessionStorage.getItem("chefInfo"));
    if (storedChef) {
      setChef(storedChef);
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, []);

  if (!chef) return <p>Loading...</p>;

  return (
    <div className="ChefInfoPage">
      <h1 className="PageTitle">
        Welcome, Chef {chef.first_name} {chef.last_name}!
      </h1>
      <div className="ChefInfoContainer">
        <div className="ChefImage">
          <img
            src={chef.profile_image_url}
            alt={chef.first_name}
            loading="lazy"
          />
        </div>
        <div className="ChefInfo">
          <div className="Info">
            <h3>📧 Culinary Correspondence:</h3>
            <p>{chef.email}</p>
          </div>
          <div className="Info">
            <h3>📞 Contact Number:</h3>
            <p>{chef.phone_number}</p>
          </div>
          <div className="Info">
            <h3>💰 Your Monthly Feast:</h3>
            <p>{chef.salary}LE</p>
          </div>
          <div className="Info">
            <h3>🍽️ Expert Cuisine Focus:</h3>
            <p>{chef.category_name}</p>
          </div>
          <div className="Info">
            <h3>🌱 Age of Wisdom:</h3>
            <p>{chef.age}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
