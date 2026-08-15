# 🚀 **AWS 3-Tier Architecture Deployment Guide**

***Build a highly available, scalable, and secure 3-tier application using AWS services.***

---

# 🏗️ **Architecture Overview**

***This project demonstrates a Production-Style AWS 3-Tier Architecture deployed across two Availability Zones (Multi-AZ) for high availability, scalability, fault tolerance, and security.***

---

## 🌐 **Presentation Layer (Web Tier)**

- **2 Public Subnets**
- **Web Server EC2**
- **Internet Gateway**
- **Frontend Application Load Balancer**

---

## ⚙️ **Application Layer (App Tier)**

- **2 Private App Subnets**
- **Flask Application**
- **Application Server EC2**
- **NAT Gateway**
- **Backend Application Load Balancer**

---

## 🗄️ **Database Layer (Data Tier)**

- **2 Private Database Subnets**
- **Amazon RDS (MySQL)**

---

# 🏛️ **Architecture Diagram**

```text
                    🌍 Internet
                          │
                          ▼
                  🌐 Internet Gateway
                          │
                          ▼
              ⚖️ Frontend Application Load Balancer
                          │
                          ▼
                  🖥️ Web Server (Public EC2)
                          │
                          ▼
               ⚖️ Backend Application Load Balancer
                          │
                          ▼
               ⚙️ Flask App Server (Private EC2)
                          │
                          ▼
                    🗄️ Amazon RDS
```

---

# 🛜 **Step 1: Create a VPC**

 **Configuration**    **Value** 

 **IPv4 CIDR**        *10.0.0.0/16* 
 **DNS Resolution**   *Enabled* 
 **DNS Hostnames**    *Enabled* 

---

# 🏗️ **Step 2: Create Six Subnets**

  **Subnet**                **Availability Zone**  **Purpose** 

  🌐 **Public Subnet 1**     *us-east-1a*          **Web Tier** 
  🌐 **Public Subnet 2**     *us-east-1b*          **Web Tier** 
  ⚙️ **App Subnet 1**        *us-east-1a*          **Application Tier** 
  ⚙️ **App Subnet 2**        *us-east-1b*          **Application Tier** 
  🗄️ **Database Subnet 1**   *us-east-1a*          **Database Tier** 
  🗄️ **Database Subnet 2**   *us-east-1b*          **Database Tier** 

---

# 🌍 **Step 3: Create an Internet Gateway**

- **Create an Internet Gateway**
- **Attach it to the VPC**

---

# 🔄 **Step 4: Create NAT Gateways**

***Create two NAT Gateways for High Availability.***

| **NAT Gateway** | **Availability Zone** |
| --- | --- |
| 🔄 **NAT Gateway 1** | *us-east-1a* |
| 🔄 **NAT Gateway 2** | *us-east-1b* |

> ⚠️ **Important**
>
> - **NAT Gateway must be created inside a Public Subnet**
> - **Allocate an Elastic IP**
> - **Map each App Subnet to the NAT Gateway in the same Availability Zone**

---

# 🛣️ **Step 5: Create Route Tables**

## 🌐 **Public Route Table**

| **Destination** | **Target** |
| --- | --- |
| *0.0.0.0/0* | **Internet Gateway** |

Associate:

- **Public Subnet 1**
- **Public Subnet 2**

---

## ⚙️ **App Route Table 1**

| **Destination** | **Target** |
| --- | --- |
| *0.0.0.0/0* | **NAT Gateway 1** |

Associate:

- **App Subnet 1**

---

## ⚙️ **App Route Table 2**

| **Destination** | **Target** |
| --- | --- |
| *0.0.0.0/0* | **NAT Gateway 2** |

Associate:

- **App Subnet 2**

---

## 🗄️ **Database Route Tables**

Associate:

- **Database Subnet 1**
- **Database Subnet 2**

> ***Database servers should remain private.***

---

# 🔐 **Step 6: Create Five Security Groups**

| **Security Group** | **Inbound Rules** |
| --- | --- |
| 🛡️ **Bastion-SG** | **SSH (22)** |
| 🌐 **WebServer-SG** | **HTTP (80), HTTPS (443), SSH (22)** |
| ⚖️ **Frontend-ALB-SG** | **HTTP (80), HTTPS (443)** |
| ⚙️ **AppServer-SG** | **5000, 80, 443, SSH from WebServer-SG** |
| 🗄️ **Database-SG** | **MySQL (3306) from AppServer-SG** |

---

# 🌎 **Step 7: Configure Route 53**

- **Create a Hosted Zone**
- **Add your Domain Name**
- **Copy the generated Name Servers**
- **Update the Domain Registrar**

---

# 🔒 **Step 8: Validate ACM Using Route 53**

- **Request a Certificate**
- **Select DNS Validation**
- **Create the CNAME Record**
- **Wait until the certificate status becomes Issued**

---

# 🗄️ **Step 9: Create Amazon RDS**

### **Create a DB Subnet Group**

- **Database Subnet 1**
- **Database Subnet 2**

### **Create a MySQL Database**

| **Configuration** | **Value** |
| --- | --- |
| **Engine** | *MySQL* |
| **Public Access** | *Disabled* |
| **Security Group** | *Database-SG* |

---

# 🖥️ **Step 10: Create a Web Server EC2 Instance**

```bash
Launch EC2 → Public Subnet 1 → Attach WebServer-SG
```

---

# ⚙️ **Step 11: Create an App Server EC2 Instance**

```bash
Launch EC2 → App Subnet 1 → Attach AppServer-SG
```

---

# 🔑 **Step 12: Connect to the App Server**

```bash
vi LearnWithMithran.pem

chmod 400 LearnWithMithran.pem

ssh -i LearnWithMithran.pem ec2-user@10.0.4.162
```

---

# 🗄️ **Step 13: Configure the Database**

```bash
sudo yum install mysql -y

mysql -h your-rds-endpoint -P 3306 -u admin -p
```

---

# 🐍 **Step 14: Configure the App Server**

```bash
sudo yum install python3 python3-pip -y

pip3 install flask flask-mysql-connector flask-cors

vi app.py

nohup python3 app.py > output.log 2>&1 &

ps -ef | grep app.py

cat output.log

curl http://10.0.3.47:5000/login
```

---

# 🌐 **Step 15: Configure the Web Server**

```bash
sudo yum install httpd -y

sudo systemctl start httpd

sudo systemctl enable httpd

cd /var/www/html/

touch index.html

touch styles.css

touch script.js
```

---

# ⚖️ **Step 16: Create the Backend Application Load Balancer**

- **Port: 5000**
- **Health Check: /login**
- **Register the App Server**

---

# 🌐 **Step 17: Create the Frontend Application Load Balancer**

- **Port: 80**
- **Health Check: /**
- **Register the Web Server**

---

# ✅ **Final Architecture Flow**

```text
👤 User
      │
      ▼
⚖️ Frontend ALB
      │
      ▼
🌐 Web Server
      │
      ▼
⚖️ Backend ALB
      │
      ▼
⚙️ Flask Application
      │
      ▼
🗄️ Amazon RDS
```

---

# 🛠️ **Technologies Used**

- ☁️ **Amazon VPC**
- 🌍 **Internet Gateway**
- 🔄 **NAT Gateway**
- 🛣️ **Route Tables**
- 🔐 **Security Groups**
- 🖥️ **Amazon EC2**
- 🗄️ **Amazon RDS**
- 🌎 **Route 53**
- 🔒 **AWS Certificate Manager**
- ⚖️ **Application Load Balancer**
- 🐍 **Python**
- 🌶️ **Flask**
- 🐬 **MySQL**
- 🌐 **Apache HTTP Server**
- 🎨 **HTML**
- 🎭 **CSS**
- ⚡ **JavaScript**
