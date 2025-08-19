# E-commerce Headless REST API

Энэ төсөл нь Express, Sequelize, болон PostgreSQL-г ашиглан бүтээгдсэн ecommerce платформын headless REST API юм. Энэ нь Medusa.js-тэй төстэй headless аргачлалыг дагаж мөрддөг бөгөөд бүтээгдэхүүн, захиалга, хэрэглэгчид болон ecommerce-тэй холбоотой бусад өгөгдлийг удирдах уян хатан backend-ийг хангадаг.

## Features

*   RESTful API endpoints
*   Data persistence with PostgreSQL
*   Object-Relational Mapping (ORM) with Sequelize
*   Modular code structure
*   UUID primary keys for models

## Supported Product Types

Энэхүү платформ нь өөр өөр хэрэгцээнд нийцүүлэн төрөл бүрийн бүтээгдэхүүний төрлийг дэмждэг:

*   **Биет:** Хүргэлт шаарддаг уламжлалт бараа (жишээ нь, 5G Router).
*   **Дижитал:** Цахим хэлбэрээр хүргэгддэг бүтээгдэхүүн (жишээ нь, Утасны дугаар).
*   **Үйлчилгээ:** Үйлчилгээг илэрхийлэх бүтээгдэхүүн, тухайлбал гар утасны данс цэнэглэх картууд. Эдгээр бүтээгдэхүүний хувьд хүргэлтийн хаяг шаардлагагүй бөгөөд гүйцэтгэл нь харилцаа холбооны оператортой (telco) шууд интеграц хийж, хэрэглэгчийн заасан утасны дугаарт цэнэглэлтийг хийх үйл явцыг агуулдаг.

## Setup

Төслийг локал орчинд суулгаж ажиллуулахын тулд дараах алхмуудыг дагана уу:

1.  **Clone the repository:**

    
```
bash
    git clone <repository_url>
    cd <repository_folder>
    
```
2.  **Install dependencies:**
```
bash
    npm install
    
```
3.  **Database Setup:**

    *   Ensure you have a PostgreSQL database running.
    *   Configure your database connection details in a configuration file (e.g., `.env` or a dedicated config file). You will need to specify the database name, username, password, host, and port.
    *   Run Sequelize migrations to create the necessary database tables. (Assuming you have Sequelize migrations set up. If not, you'll need to create and run them.)

    
```
bash
    npx sequelize-cli db:migrate
    
```
4.  **Environment Variables:**

    Create a `.env` file in the root of the project and add necessary environment variables, such as database connection details and any other configuration settings.
```
env
    DB_DATABASE=your_database_name
    DB_USERNAME=your_username
    DB_PASSWORD=your_password
    DB_HOST=your_db_host
    DB_PORT=your_db_port
    # Add other environment variables as needed
    
```
## Running the Application

To start the API server, run the following command:
```
bash
npm start
```
The API will be accessible at the specified port (default is usually 3000, but check your configuration).

## Technologies Used

*   **Express:** Fast, unopinionated, minimalist web framework for Node.js.
*   **Sequelize:** A promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server.
*   **PostgreSQL:** A powerful, open source object-relational database system.

## Бараа бүтээгдхүүн
ene ecommerce telco бүтээгдхүүн зарна.

1. 4g router.
2. утасны дугаар.
3. esim зарна сонгосон дугаартай.
4. утасны нэмэлт дата сонгосон дугаарт.
5. утасны нэгж сонгосон дугаарт.
6. esim сэргээх үйлчилгээ.
7. үндсэн subscription нь сервис дагалдах нэгж, ярианы эрх, мэссэж багцтай байна.


### 4g router худалдан авах
4g router худалдаж байгаа бол өөрийн хаяг дээр хүргэлтээр эсвэл, 
үлдэгдэлтэй салбар дээрээс сонгож очиж авахаар зарна.

### Утасны нэгж худалдан авах
Утасны нэгж худалдан авч байгаа үед, цэнэглэх дугаараа давхар оруулах шаардлагатай. 
Утасны нэгж авч байх үед барааны үлдэгдэл нэгж тоо бүртгэл байх шаардлага байхгүй. 
Мөн хүргэлт хийх шаардлага байхгүй болно.

### Утасны дугаар худалдан авах
Утасны дугаар худалдан авахдаа дараа идэвхжүүлэх, шууд идэвхжүүлэх сонголтой байна. 
Дараа идэвхжүүлэх сонгосон үед худалдан авсан идэвхжүүлээгүй дугаар байна. Дараа нь нь идэвхжүүлэх боломжтой байна.
Шууд идэвхжүүлэх үед esim, эсвэл physical sim идэвхжүүлэх нууц код оруулдаг байна. (physical сим болгон unique activation code той болно.)


### coupon campaign ашиглах рулъ
* Зарим хэрэглэгчид купон код илгээнэ зөвхөн тухайн хүн л ашиглах боломжтой байна.
* Хэрэглэгч купоны ашиглалтын төлвийг хадгалаад явна.
* Тухайн coupon campaign статистик гаргана.
* Зарим купон кодыг олон хэрэглэгч хэрэглэгч 1 л удаа ашиглах боломжтой байна гэвэл яаж хийх вэ
