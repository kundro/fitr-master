import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white text-center py-3">
      <div className="container">
        &copy; TaskCraft: Learning Management - {currentYear}
      </div>
    </footer>
  );
}
