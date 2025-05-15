import React from "react";

const NotFound = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404 - Page Not Found</h1>
      <p style={styles.text}>
        The page you are looking for doesn't exist or has been moved.
      </p>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    color: "#333",
  },
  heading: {
    fontSize: "48px",
    marginBottom: "20px",
  },
  text: {
    fontSize: "18px",
  },
};

export default NotFound;
