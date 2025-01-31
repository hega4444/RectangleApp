# Rectangle SVG Application

## Overview

This project consists of a React frontend and a C# backend that allows users to draw and resize a rectangle SVG. The perimeter of the rectangle is displayed and updated based on user interactions.

## Features

- **Resizable Rectangle**: Users can resize the rectangle using the mouse.
- **Perimeter Display**: Shows the current perimeter of the rectangle.
- **Initial Dimensions**: Loads initial dimensions from a JSON file via API.
- **Backend Validation**: Validates on the backend that the rectangle's width does not exceed its height with a simulated delay.

## Technologies Used

- **Frontend**: React, TypeScript, Material UI
- **Backend**: C#, ASP.NET Core
- **Others**: SVG for graphics

## Setup Instructions

### Prerequisites

- **Node.js and npm**: [Download and install](https://nodejs.org/)
- **.NET 6 SDK**: [Download and install](https://dotnet.microsoft.com/download/dotnet/6.0)

### Frontend Setup

1. **Navigate to the `ClientApp` directory**:

    ```bash
    cd ClientApp
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the frontend application**:

    ```bash
    npm start
    ```

### Backend Setup

1. **Navigate to the `Backend` directory**:

    ```bash
    cd Backend
    ```

2. **Restore dependencies**:

    ```bash
    dotnet restore
    ```

3. **Run the backend application**:

    ```bash
    dotnet run
    ```

## Project Structure 