import React, { useContext } from "react";
import { AuthContext } from "../firebase/Auth";

const HomePage = () => {
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="homePage">
      <header>
        <h1>TaskTopia</h1>
      </header>
      <div>
        <p>
          Introducing TaskTopia - a task manager web application designed to
          &apos;gamify&apos; productivity. Each user that signs up for TaskTopia
          has their own city of which they can add buildings. However, the
          buildings available are at a basic level and can only be leveled up if
          the user consistently completes tasks they have listed. Each building
          can represent a category of tasks, ranging from personal daily chores
          to big projects. Additionally, each building has an avatar that
          interacts with the user about the tasks they need to get completed.
          Users can customize the avatar into people they know by uploading an
          image to the website. So if you want your mom yelling at you if you
          haven&apos;t done your laundry yet, then now you can!
        </p>
      </div>
      <br />
      {!currentUser ? (
        <footer>
          <p>Log In or Sign Up to get started!</p>
        </footer>
      ) : (
        <footer>Welcome!</footer>
      )}
    </div>
  );
};

export default HomePage;
