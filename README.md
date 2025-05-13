# cloud-monitor-api

A simple Node.js/Express API for monitoring and reporting system resource usage (CPU, memory, disk, and bandwidth). Built as a cloud-ready, Dockerized backend service with automated testing and CI/CD, this project demonstrates key cloud computing and DevOps practices.

---

## Features

- **RESTful API Endpoints** for:
  - CPU usage
  - Memory usage
  - Disk usage
  - Bandwidth usage
- **API Key Authentication** for secure access
- **Automated Testing** with Jest & Supertest
- **Code Coverage Reports** with enforced thresholds
- **Static Code Analysis** using ESLint
- **CI/CD Pipeline** with CircleCI for automated build, test, and Docker deployment
- **Dockerized Application** ready for cloud deployment

---

## API Endpoints

All endpoints require a valid API key in the `x-api-key` header.

| Endpoint      | Description           |
|---------------|----------------------|
| `/cpu`        | Returns CPU usage    |
| `/memory`     | Returns memory usage |
| `/disk`       | Returns disk usage   |
| `/bandwidth`  | Returns bandwidth    |

---

## Getting Started

### Prerequisites

- Node.js (v14+)
- Docker (optional, for containerization)

### Installation

```bash
git clone https://github.com/sohan2000/cloud-monitor-api.git
cd cloud-monitor-api
npm install
```

### Running the Server

```bash
npm start
```

### Running Tests

```bash
npm test
```

### Building & Running with Docker

```bash
docker build -t cloud-monitor-api .
docker run -p 3000:3000 cloud-monitor-api
```

---

## CI/CD

- **CircleCI** is used for continuous integration.
- On every push, tests and linting run automatically.
- Code coverage is checked and must meet minimum thresholds.
- Docker images are built and pushed to Docker Hub for deployment.

---

## Learnings & Key Metrics

- **Cloud-Native Development:** Built a stateless, containerized API ready for cloud deployment.
- **API Security:** Implemented API key authentication for all endpoints.
- **Testing & Quality:** Achieved >90% code coverage with automated tests and enforced code quality with ESLint.
- **CI/CD Automation:** Set up a full CI/CD pipeline using CircleCI for reliable builds and deployments.
- **Dockerization:** Learned to package the app for consistent deployment across environments.
- **Cloud Deployment:** Prepared the app for deployment on AWS EC2 or similar platforms.

---

## License

This project is for educational purposes only.

---

**Author:** Sohan (sohan2000)  
**Repo:** cloud-monitor-api  
**Course:** CS218 - Topics in Cloud Computing  
**Assignment:** Homework 2

---

*Happy Monitoring!* 🚀
