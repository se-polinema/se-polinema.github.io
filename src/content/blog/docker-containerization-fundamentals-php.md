---
title: "Docker & Containerization Fundamentals with PHP"
titleId: "Dasar-Dasar Docker & Kontainerisasi dengan PHP"
date: 2026-07-13
updated: 2026-07-13
category: tutorial
author: SE Lab
lang: en
featured: false
excerpt: "A hands-on introduction to Docker and containerization for PHP developers. Learn images, containers, Dockerfiles, and docker-compose by building a multi-service PHP + Nginx + MySQL stack from scratch."
excerptId: "Pengenalan langsung Docker dan kontainerisasi untuk pengembang PHP. Pelajari image, container, Dockerfile, dan docker-compose dengan membangun stack multi-layanan PHP + Nginx + MySQL dari awal."
stream: se-methodologies-architecture
tags:
  - Docker
  - Containerization
  - PHP
  - DevOps
tagsId:
  - Docker
  - Kontainerisasi
  - PHP
  - DevOps
---

<section lang="en">

## Why Containers?

Every PHP developer has heard (or said) the phrase "it works on my machine." Your colleague runs `composer install` and the app breaks because they have PHP 8.1 but the production server runs 7.4. Or a junior developer spends two days configuring Apache just to run a ten-line PHP script.

**Containers solve the "works on my machine" problem.** A container packages your application code, PHP runtime, extensions, web server, and all dependencies into a single lightweight, portable unit. That unit runs identically on your laptop, your teammate's Windows machine, a CI server, and the production cloud — no surprises.

**Why Docker for PHP?** PHP applications are rarely self-contained. A typical project needs:

- A PHP runtime with specific extensions (`pdo_mysql`, `gd`, `redis`)
- A web server (Nginx or Apache) configured to forward requests to PHP-FPM
- A MySQL or PostgreSQL database
- Redis for caching / sessions
- Composer for dependency management

Installing and configuring all of these locally is tedious and error-prone. Docker lets you define the entire stack as code — a `Dockerfile` for your app and a `docker-compose.yml` for the orchestration — and spin it up with two commands.

By the end of this tutorial, you will have a running PHP + Nginx + MySQL application, fully containerized, with live-reload for development. You will also understand how and why the existing [Microservices Architecture Fundamentals tutorial](/blog/microservices-architecture-fundamentals) uses containers to decompose a monolith into independently deployable services.

</section>

<section lang="id">

## Mengapa Kontainer?

Setiap pengembang PHP pernah mendengar (atau mengatakan) frasa "di komputer saya berfungsi." Rekan Anda menjalankan `composer install` dan aplikasi *error* karena mereka menggunakan PHP 8.1 tetapi server produksi berjalan di 7.4. Atau pengembang junior menghabiskan dua hari mengonfigurasi Apache hanya untuk menjalankan skrip PHP sepuluh baris.

**Kontainer menyelesaikan masalah "di komputer saya berfungsi."** Sebuah kontainer mengemas kode aplikasi Anda, *runtime* PHP, ekstensi, *web server*, dan semua dependensi ke dalam satu unit yang ringan dan portabel. Unit tersebut berjalan secara identik di laptop Anda, komputer Windows rekan Anda, server CI, dan *cloud* produksi, tanpa kejutan.

**Mengapa Docker untuk PHP?** Aplikasi PHP jarang berdiri sendiri. Sebuah proyek tipikal membutuhkan:

- *Runtime* PHP dengan ekstensi spesifik (`pdo_mysql`, `gd`, `redis`)
- *Web server* (Nginx atau Apache) yang dikonfigurasi untuk meneruskan permintaan ke PHP-FPM
- Database MySQL atau PostgreSQL
- Redis untuk *caching* / *session*
- Composer untuk manajemen dependensi

Menginstal dan mengonfigurasi semua ini secara lokal itu membosankan dan rawan kesalahan. Docker memungkinkan Anda mendefinisikan seluruh *stack* sebagai kode: sebuah `Dockerfile` untuk aplikasi dan `docker-compose.yml` untuk orkestrasi, lalu menjalankannya dengan dua perintah.

Di akhir tutorial ini, Anda akan memiliki aplikasi PHP + Nginx + MySQL yang berjalan, sepenuhnya terkontainerisasi, dengan *live-reload* untuk pengembangan. Anda juga akan memahami bagaimana dan mengapa tutorial [Microservices Architecture Fundamentals](/blog/microservices-architecture-fundamentals) yang sudah ada menggunakan kontainer untuk mendekomposisi *monolith* menjadi layanan yang dapat di-deploy secara independen.

</section>

---

<section lang="en">

## Installing Docker

### Docker Desktop (Windows / macOS)

[Docker Desktop](https://www.docker.com/products/docker-desktop/) is the recommended installation for Windows and macOS. It includes the Docker Engine, Docker CLI (`docker`), Docker Compose (`docker compose`), and a lightweight Kubernetes cluster — all managed through a GUI.

1. Download the installer from [docker.com](https://www.docker.com/products/docker-desktop/).
2. Run the installer. On Windows, you may need to enable WSL 2.
3. After installation, open a terminal and verify:

```bash
docker --version
# Docker version 26.0.0, build ...

docker compose version
# Docker Compose version v2.26.0
```

4. Run the hello-world container to confirm everything works:

```bash
docker run hello-world
```

If you see "Hello from Docker!" you are ready.

### Docker Engine (Linux)

On Linux, install Docker Engine directly via your package manager. The following commands work for Ubuntu/Debian:

```bash
# Add Docker's official GPG key
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

Verify the installation:

```bash
docker --version
docker compose version
```

Add your user to the `docker` group to run Docker without `sudo`:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

</section>

<section lang="id">

## Menginstal Docker

### Docker Desktop (Windows / macOS)

[Docker Desktop](https://www.docker.com/products/docker-desktop/) adalah instalasi yang direkomendasikan untuk Windows dan macOS. Ini mencakup Docker Engine, Docker CLI (`docker`), Docker Compose (`docker compose`), dan kluster Kubernetes ringan, semuanya dikelola melalui GUI.

1. Unduh *installer* dari [docker.com](https://www.docker.com/products/docker-desktop/).
2. Jalankan *installer*. Di Windows, Anda mungkin perlu mengaktifkan WSL 2.
3. Setelah instalasi, buka terminal dan verifikasi:

```bash
docker --version
# Docker version 26.0.0, build ...

docker compose version
# Docker Compose version v2.26.0
```

4. Jalankan kontainer hello-world untuk memastikan semuanya berfungsi:

```bash
docker run hello-world
```

Jika Anda melihat "Hello from Docker!", Anda sudah siap.

### Docker Engine (Linux)

Di Linux, instal Docker Engine langsung melalui *package manager*. Perintah berikut berfungsi untuk Ubuntu/Debian:

```bash
# Tambahkan GPG key resmi Docker
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Tambahkan repositori
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
  https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin
```

Verifikasi instalasi:

```bash
docker --version
docker compose version
```

Tambahkan pengguna Anda ke grup `docker` untuk menjalankan Docker tanpa `sudo`:

```bash
sudo usermod -aG docker $USER
newgrp docker
```

</section>

---

<section lang="en">

## Core Concepts

Before writing any code, let's understand the six fundamental Docker concepts. These appear in every Docker command, every `Dockerfile`, and every `docker-compose.yml`.

<figure>
  <figcaption class="mt-3 text-sm text-neutral-500">
    <span lang="en">Figure: Docker core concepts — how images, containers, registries, Dockerfiles, and docker-compose relate.</span>
    <span lang="id">Gambar: Konsep inti Docker — bagaimana image, container, registry, Dockerfile, dan docker-compose saling berhubungan.</span>
  </figcaption>
</figure>

### Image

An **image** is a read-only template with instructions for creating a container. Think of it as a snapshot of a filesystem — it contains the OS layer, the PHP runtime, your application code, and any dependencies. Images are built from instructions in a `Dockerfile`.

```bash
docker images          # list all local images
docker pull php:8.2-fpm  # download an image from a registry
docker rmi php:8.2-fpm   # remove an image
```

Images are **layered**: each instruction in a `Dockerfile` (`FROM`, `RUN`, `COPY`) creates a new layer. Docker caches layers to speed up rebuilds — if a line hasn't changed, Docker reuses the cached layer.

### Container

A **container** is a running instance of an image. If an image is a class, a container is an object. You can run multiple containers from the same image, each with its own isolated filesystem, network, and process space.

```bash
docker run php:8.2-fpm     # run a container from an image
docker ps                   # list running containers
docker ps -a                # list all containers (including stopped)
docker stop <container-id>  # stop a running container
docker rm <container-id>    # remove a stopped container
```

### Layer

Each instruction in a `Dockerfile` produces a **layer**. Layers are stacked to form the final image. Docker caches layers independently — meaning if you change only your application code, only the `COPY` layer is rebuilt; the PHP installation layer stays cached.

This is why `Dockerfile` ordering matters: put commands that change least often (OS updates, PHP installation) at the top, and commands that change most often (your source code) at the bottom.

### Registry

A **registry** stores and distributes images. [Docker Hub](https://hub.docker.com) is the default public registry. When you run `docker pull php:8.2-fpm`, Docker downloads the image from Docker Hub (or a mirror).

```bash
docker pull nginx:alpine       # pull from Docker Hub
docker tag my-app:latest my-registry.com/my-app:v1  # tag for a private registry
docker push my-registry.com/my-app:v1                # push to a private registry
```

### Dockerfile

A `Dockerfile` is a text file that contains instructions for building an image. We will write one shortly, but here is the anatomy:

```dockerfile
FROM php:8.2-fpm              # base image
RUN docker-php-ext-install pdo_mysql  # run a command during build
COPY . /var/www/html          # copy files from host to image
WORKDIR /var/www/html          # set the working directory
EXPOSE 9000                   # document which port the container listens on
CMD ["php-fpm"]               # default command when the container starts
```

### docker-compose

`docker-compose` (invoked as `docker compose` in modern Docker) is a tool for defining and running **multi-container** applications. You describe services, networks, and volumes in a YAML file, and Docker Compose creates and starts all of them with a single command.

```yaml
services:
  app:        # our PHP-FPM container
    build: .
  web:        # Nginx reverse proxy
    image: nginx:alpine
  db:         # MySQL database
    image: mysql:8.0
```

The key insight: each service in a compose file runs in its own container, but they share a user-defined network. Containers can reach each other by service name (e.g., `db` resolves to the MySQL container's IP).

</section>

<section lang="id">

## Konsep Inti

Sebelum menulis kode apa pun, mari pahami enam konsep dasar Docker. Konsep ini muncul di setiap perintah Docker, setiap `Dockerfile`, dan setiap `docker-compose.yml`.

<figure>
  <figcaption class="mt-3 text-sm text-neutral-500">
    <span lang="en">Figure: Docker core concepts — how images, containers, registries, Dockerfiles, and docker-compose relate.</span>
    <span lang="id">Gambar: Konsep inti Docker — bagaimana image, container, registry, Dockerfile, dan docker-compose saling berhubungan.</span>
  </figcaption>
</figure>

### Image

**Image** adalah template *read-only* dengan instruksi untuk membuat kontainer. Anggap sebagai *snapshot* dari *filesystem*: berisi lapisan OS, *runtime* PHP, kode aplikasi Anda, dan semua dependensi. Image dibangun dari instruksi dalam `Dockerfile`.

```bash
docker images          # daftar semua image lokal
docker pull php:8.2-fpm  # unduh image dari registry
docker rmi php:8.2-fpm   # hapus image
```

Image bersifat **berlapis (layered)**: setiap instruksi dalam `Dockerfile` (`FROM`, `RUN`, `COPY`) membuat lapisan baru. Docker meng-cache lapisan untuk mempercepat *rebuild*: jika sebuah baris tidak berubah, Docker menggunakan kembali lapisan yang di-cache.

### Container

**Container** adalah *instance* berjalan dari sebuah image. Jika image adalah kelas, container adalah objek. Anda dapat menjalankan beberapa container dari image yang sama, masing-masing dengan *filesystem*, jaringan, dan ruang proses yang terisolasi.

```bash
docker run php:8.2-fpm     # jalankan container dari image
docker ps                   # daftar container yang berjalan
docker ps -a                # daftar semua container (termasuk yang berhenti)
docker stop <container-id>  # hentikan container yang berjalan
docker rm <container-id>    # hapus container yang berhenti
```

### Layer

Setiap instruksi dalam `Dockerfile` menghasilkan sebuah **layer**. Layer ditumpuk untuk membentuk image final. Docker meng-cache layer secara independen: artinya jika Anda hanya mengubah kode aplikasi, hanya layer `COPY` yang dibangun ulang; layer instalasi PHP tetap di-cache.

Inilah mengapa urutan `Dockerfile` penting: letakkan perintah yang paling jarang berubah (pembaruan OS, instalasi PHP) di bagian atas, dan perintah yang paling sering berubah (kode sumber Anda) di bagian bawah.

### Registry

**Registry** menyimpan dan mendistribusikan image. [Docker Hub](https://hub.docker.com) adalah registry publik default. Ketika Anda menjalankan `docker pull php:8.2-fpm`, Docker mengunduh image dari Docker Hub (atau *mirror*).

```bash
docker pull nginx:alpine       # tarik dari Docker Hub
docker tag my-app:latest my-registry.com/my-app:v1  # beri tag untuk registry pribadi
docker push my-registry.com/my-app:v1                # dorong ke registry pribadi
```

### Dockerfile

**Dockerfile** adalah file teks yang berisi instruksi untuk membangun image. Kita akan menulisnya sebentar lagi, tetapi berikut anatominya:

```dockerfile
FROM php:8.2-fpm              # image dasar
RUN docker-php-ext-install pdo_mysql  # jalankan perintah saat build
COPY . /var/www/html          # salin file dari host ke image
WORKDIR /var/www/html          # atur direktori kerja
EXPOSE 9000                   # dokumentasikan port yang didengarkan container
CMD ["php-fpm"]               # perintah default saat container dimulai
```

### docker-compose

`docker-compose` (dipanggil sebagai `docker compose` di Docker modern) adalah alat untuk mendefinisikan dan menjalankan aplikasi **multi-container**. Anda mendeskripsikan layanan, jaringan, dan volume dalam file YAML, dan Docker Compose membuat dan memulai semuanya dengan satu perintah.

```yaml
services:
  app:        # container PHP-FPM kita
    build: .
  web:        # reverse proxy Nginx
    image: nginx:alpine
  db:         # database MySQL
    image: mysql:8.0
```

Wawasan kunci: setiap layanan dalam file compose berjalan di kontainernya sendiri, tetapi mereka berbagi jaringan yang didefinisikan pengguna. Container dapat saling menjangkau dengan nama layanan (misalnya, `db` diterjemahkan ke IP container MySQL).

</section>

---

<section lang="en">

## Your First PHP Container

Let's start with the simplest possible container: a single PHP script that prints "Hello, Docker!" We will write a `Dockerfile`, build the image, and run it.

### Step 1: Create the project

```bash
mkdir docker-php-demo && cd docker-php-demo
```

### Step 2: Write a simple PHP script

Create `index.php`:

```php
<?php
echo "Hello, Docker! PHP " . phpversion() . " is running.\n";

// Verify extensions
echo "Loaded extensions: " . implode(", ", get_loaded_extensions()) . "\n";
```

### Step 3: Write a Dockerfile

Create `Dockerfile` (no extension, capital D):

```dockerfile
FROM php:8.2-cli

WORKDIR /app

COPY index.php .

CMD ["php", "index.php"]
```

Let's read this line by line:

| Instruction | Meaning |
|-------------|---------|
| `FROM php:8.2-cli` | Start from the official PHP 8.2 CLI image (includes PHP binary, no web server) |
| `WORKDIR /app` | Create and enter `/app` inside the container |
| `COPY index.php .` | Copy `index.php` from the host to `/app/` in the image |
| `CMD ["php", "index.php"]` | When the container starts, run `php index.php` |

### Step 4: Build the image

```bash
docker build -t php-hello .
```

- `-t php-hello` names (tags) the image `php-hello`
- `.` tells Docker to use the current directory as the build context

Docker will pull the `php:8.2-cli` base image (first time only) and execute each instruction. You will see output like:

```
[1/3] FROM php:8.2-cli@sha256:...
[2/3] WORKDIR /app
[3/3] COPY index.php .
```

### Step 5: Run the container

```bash
docker run --rm php-hello
```

- `--rm` automatically removes the container when it exits (keeps your system clean)

Output:

```
Hello, Docker! PHP 8.2.x is running.
Loaded extensions: Core, date, libxml, openssl, ...
```

Congratulations — you have just built and run your first PHP Docker container.

### Step 6: Interactive mode

The CLI image also lets you run PHP interactively:

```bash
docker run --rm -it php-hello bash
# Now you are inside the container:
php -v
php -m
ls -la
exit
```

`-it` allocates an interactive terminal (`-i` for stdin, `-t` for a TTY).

</section>

<section lang="id">

## Kontainer PHP Pertama Anda

Mari mulai dengan kontainer paling sederhana: sebuah skrip PHP yang mencetak "Hello, Docker!" Kita akan menulis `Dockerfile`, membangun image, dan menjalankannya.

### Langkah 1: Buat proyek

```bash
mkdir docker-php-demo && cd docker-php-demo
```

### Langkah 2: Tulis skrip PHP sederhana

Buat `index.php`:

```php
<?php
echo "Halo, Docker! PHP " . phpversion() . " sedang berjalan.\n";

// Verifikasi ekstensi
echo "Ekstensi yang dimuat: " . implode(", ", get_loaded_extensions()) . "\n";
```

### Langkah 3: Tulis Dockerfile

Buat `Dockerfile` (tanpa ekstensi, huruf D kapital):

```dockerfile
FROM php:8.2-cli

WORKDIR /app

COPY index.php .

CMD ["php", "index.php"]
```

Mari baca baris demi baris:

| Instruksi | Arti |
|-----------|------|
| `FROM php:8.2-cli` | Mulai dari image PHP 8.2 CLI resmi (mencakup *binary* PHP, tanpa *web server*) |
| `WORKDIR /app` | Buat dan masuk ke `/app` di dalam container |
| `COPY index.php .` | Salin `index.php` dari host ke `/app/` di dalam image |
| `CMD ["php", "index.php"]` | Saat container dimulai, jalankan `php index.php` |

### Langkah 4: Bangun image

```bash
docker build -t php-hello .
```

- `-t php-hello` memberi nama (tag) image `php-hello`
- `.` memberi tahu Docker untuk menggunakan direktori saat ini sebagai konteks *build*

Docker akan menarik image dasar `php:8.2-cli` (hanya pertama kali) dan mengeksekusi setiap instruksi. Anda akan melihat output seperti:

```
[1/3] FROM php:8.2-cli@sha256:...
[2/3] WORKDIR /app
[3/3] COPY index.php .
```

### Langkah 5: Jalankan container

```bash
docker run --rm php-hello
```

- `--rm` otomatis menghapus container saat keluar (menjaga sistem tetap bersih)

Output:

```
Halo, Docker! PHP 8.2.x sedang berjalan.
Ekstensi yang dimuat: Core, date, libxml, openssl, ...
```

Selamat! Anda baru saja membangun dan menjalankan container Docker PHP pertama Anda.

### Langkah 6: Mode interaktif

Image CLI juga memungkinkan Anda menjalankan PHP secara interaktif:

```bash
docker run --rm -it php-hello bash
# Sekarang Anda berada di dalam container:
php -v
php -m
ls -la
exit
```

`-it` mengalokasikan terminal interaktif (`-i` untuk stdin, `-t` untuk TTY).

</section>

---

<section lang="en">

## Multi-Container PHP Stack

A real PHP application rarely uses the CLI image alone. Production apps need a web server, PHP-FPM for processing PHP, and a database. Let's build a **PHP + Nginx + MySQL** stack using `docker-compose`.

Our architecture looks like this:

<figure>
  <figcaption class="mt-3 text-sm text-neutral-500">
    <span lang="en">Figure: Multi-container architecture — Nginx handles HTTP and proxies PHP requests to PHP-FPM, which talks to MySQL.</span>
    <span lang="id">Gambar: Arsitektur multi-container — Nginx menangani HTTP dan meneruskan permintaan PHP ke PHP-FPM, yang berkomunikasi dengan MySQL.</span>
  </figcaption>
</figure>

### Project Structure

```
docker-php-stack/
├── docker-compose.yml
├── Dockerfile
├── nginx/
│   └── default.conf
├── public/
│   └── index.php
└── src/
    └── Database.php
```

### Step 1: The PHP application

Create `public/index.php` — the entry point that Nginx will serve:

```php
<?php
require_once __DIR__ . '/../src/Database.php';

try {
    $db = new Database();
    $connection = $db->getConnection();
    echo "<h1>Docker PHP + Nginx + MySQL</h1>";
    echo "<p>PHP " . phpversion() . " is running.</p>";

    $stmt = $connection->query("SELECT 'Connected to MySQL successfully!' AS message");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p><strong>" . $row['message'] . "</strong></p>";

    echo "<p>Server time: " . date('Y-m-d H:i:s') . "</p>";
} catch (Exception $e) {
    echo "<p style='color:red;'>Error: " . $e->getMessage() . "</p>";
}
```

Create `src/Database.php` — a simple PDO wrapper:

```php
<?php
class Database
{
    private PDO $pdo;

    public function __construct()
    {
        $host = getenv('DB_HOST') ?: 'db';
        $dbname = getenv('DB_NAME') ?: 'docker_demo';
        $user = getenv('DB_USER') ?: 'docker_user';
        $password = getenv('DB_PASSWORD') ?: 'docker_pass';

        $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";

        $this->pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }

    public function getConnection(): PDO
    {
        return $this->pdo;
    }
}
```

> Notice that `$host = getenv('DB_HOST') ?: 'db'` uses the **service name** `db` from `docker-compose.yml` as the hostname. Docker's internal DNS resolves service names to container IPs automatically.

### Step 2: The Dockerfile for PHP-FPM

Create `Dockerfile` in the project root:

```dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN chown -R www-data:www-data /var/www/html
```

Let's break this down:

| Instruction | Purpose |
|-------------|---------|
| `FROM php:8.2-fpm` | Official PHP-FPM image — PHP runs as a FastCGI process, not an HTTP server |
| `apt-get update && apt-get install -y libpq-dev` | Install system packages needed for PHP extensions |
| `docker-php-ext-install pdo pdo_mysql` | Install PHP extensions (helper script included in the official image) |
| `COPY --from=composer:2 ...` | Copy the Composer binary from the official Composer image (multi-stage copy) |
| `COPY . .` | Copy our application code into the image |
| `RUN chown ...` | Ensure the web server user (`www-data`) owns the files |

### Step 3: Nginx configuration

Create `nginx/default.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

Key line: `fastcgi_pass app:9000` — Nginx forwards PHP requests to the `app` service (our PHP-FPM container) on port 9000.

### Step 4: The docker-compose.yml

Create `docker-compose.yml` in the project root:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: php_app
    environment:
      DB_HOST: db
      DB_NAME: docker_demo
      DB_USER: docker_user
      DB_PASSWORD: docker_pass
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./public:/var/www/html/public
      - ./src:/var/www/html/src
    networks:
      - app-network

  web:
    image: nginx:alpine
    container_name: nginx_web
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./public:/var/www/html/public
    depends_on:
      - app
    networks:
      - app-network

  db:
    image: mysql:8.0
    container_name: mysql_db
    environment:
      MYSQL_ROOT_PASSWORD: root_secret
      MYSQL_DATABASE: docker_demo
      MYSQL_USER: docker_user
      MYSQL_PASSWORD: docker_pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 10s
      retries: 5
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:
    driver: bridge
```

Let's walk through each service:

#### `app` (PHP-FPM)

- **build**: builds the image from our `Dockerfile`
- **environment**: passes database credentials as environment variables (read by `getenv()` in `Database.php`)
- **depends_on**: waits for MySQL to be healthy before starting
- **volumes**: mounts `./public` and `./src` from the host into the container — changes you make locally are reflected immediately (no rebuild needed)

#### `web` (Nginx)

- **image**: uses the official Nginx Alpine image (5 MB, very small)
- **ports**: maps host port 8080 to container port 80 — visit `http://localhost:8080`
- **volumes**: mounts our Nginx config and the `public/` directory

#### `db` (MySQL)

- **environment**: sets root password, creates a database and a user
- **volumes**: `db_data` persists database files across container restarts
- **healthcheck**: tells Docker how to check if MySQL is ready; `app` waits for this

### Step 5: Build and run

```bash
docker compose up -d
```

- `-d` runs containers in detached (background) mode

Docker will:
1. Pull the `nginx:alpine` and `mysql:8.0` images
2. Build the `app` image from our `Dockerfile`
3. Create the `app-network` bridge network and `db_data` volume
4. Start `db` first, wait for it to be healthy, then start `app` and `web`

Check that everything is running:

```bash
docker compose ps
```

Open a browser and visit `http://localhost:8080`. You should see:

```
Docker PHP + Nginx + MySQL
PHP 8.2.x is running.
Connected to MySQL successfully!
Server time: 2026-07-13 14:30:00
```

### Step 6: Stop everything

```bash
docker compose down
```

This stops and removes all containers. Add `-v` to also remove the named volume (`db_data`):

```bash
docker compose down -v
```

### Common docker compose commands

```bash
docker compose up -d          # start services in background
docker compose down            # stop and remove all services
docker compose ps              # list service status
docker compose logs app        # view logs for the 'app' service
docker compose logs -f         # follow all logs (like tail -f)
docker compose exec app bash   # open a shell inside the 'app' container
docker compose restart app     # restart the 'app' service
```

</section>

<section lang="id">

## Stack PHP Multi-Container

Aplikasi PHP nyata jarang hanya menggunakan image CLI. Aplikasi produksi membutuhkan *web server*, PHP-FPM untuk memproses PHP, dan database. Mari bangun *stack* **PHP + Nginx + MySQL** menggunakan `docker-compose`.

Arsitektur kita terlihat seperti ini:

<figure>
  <figcaption class="mt-3 text-sm text-neutral-500">
    <span lang="en">Figure: Multi-container architecture — Nginx handles HTTP and proxies PHP requests to PHP-FPM, which talks to MySQL.</span>
    <span lang="id">Gambar: Arsitektur multi-container — Nginx menangani HTTP dan meneruskan permintaan PHP ke PHP-FPM, yang berkomunikasi dengan MySQL.</span>
  </figcaption>
</figure>

### Struktur Proyek

```
docker-php-stack/
├── docker-compose.yml
├── Dockerfile
├── nginx/
│   └── default.conf
├── public/
│   └── index.php
└── src/
    └── Database.php
```

### Langkah 1: Aplikasi PHP

Buat `public/index.php`, titik masuk yang akan dilayani Nginx:

```php
<?php
require_once __DIR__ . '/../src/Database.php';

try {
    $db = new Database();
    $connection = $db->getConnection();
    echo "<h1>Docker PHP + Nginx + MySQL</h1>";
    echo "<p>PHP " . phpversion() . " sedang berjalan.</p>";

    $stmt = $connection->query("SELECT 'Berhasil terhubung ke MySQL!' AS pesan");
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    echo "<p><strong>" . $row['pesan'] . "</strong></p>";

    echo "<p>Waktu server: " . date('Y-m-d H:i:s') . "</p>";
} catch (Exception $e) {
    echo "<p style='color:red;'>Error: " . $e->getMessage() . "</p>";
}
```

Buat `src/Database.php`, *wrapper* PDO sederhana:

```php
<?php
class Database
{
    private PDO $pdo;

    public function __construct()
    {
        $host = getenv('DB_HOST') ?: 'db';
        $dbname = getenv('DB_NAME') ?: 'docker_demo';
        $user = getenv('DB_USER') ?: 'docker_user';
        $password = getenv('DB_PASSWORD') ?: 'docker_pass';

        $dsn = "mysql:host={$host};dbname={$dbname};charset=utf8mb4";

        $this->pdo = new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }

    public function getConnection(): PDO
    {
        return $this->pdo;
    }
}
```

> Perhatikan bahwa `$host = getenv('DB_HOST') ?: 'db'` menggunakan **nama layanan** `db` dari `docker-compose.yml` sebagai *hostname*. DNS internal Docker menerjemahkan nama layanan ke IP container secara otomatis.

### Langkah 2: Dockerfile untuk PHP-FPM

Buat `Dockerfile` di root proyek:

```dockerfile
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    libpq-dev \
    && docker-php-ext-install pdo pdo_mysql

WORKDIR /var/www/html

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN chown -R www-data:www-data /var/www/html
```

Mari uraikan:

| Instruksi | Tujuan |
|-----------|--------|
| `FROM php:8.2-fpm` | Image PHP-FPM resmi: PHP berjalan sebagai proses FastCGI, bukan server HTTP |
| `apt-get update && apt-get install -y libpq-dev` | Instal paket sistem yang diperlukan untuk ekstensi PHP |
| `docker-php-ext-install pdo pdo_mysql` | Instal ekstensi PHP (skrip bantuan yang disertakan dalam image resmi) |
| `COPY --from=composer:2 ...` | Salin *binary* Composer dari image Composer resmi (salinan *multi-stage*) |
| `COPY . .` | Salin kode aplikasi kita ke dalam image |
| `RUN chown ...` | Pastikan pengguna web server (`www-data`) memiliki file |

### Langkah 3: Konfigurasi Nginx

Buat `nginx/default.conf`:

```nginx
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass app:9000;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

Baris kunci: `fastcgi_pass app:9000`, Nginx meneruskan permintaan PHP ke layanan `app` (container PHP-FPM kita) di port 9000.

### Langkah 4: docker-compose.yml

Buat `docker-compose.yml` di root proyek:

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: php_app
    environment:
      DB_HOST: db
      DB_NAME: docker_demo
      DB_USER: docker_user
      DB_PASSWORD: docker_pass
    depends_on:
      db:
        condition: service_healthy
    volumes:
      - ./public:/var/www/html/public
      - ./src:/var/www/html/src
    networks:
      - app-network

  web:
    image: nginx:alpine
    container_name: nginx_web
    ports:
      - "8080:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
      - ./public:/var/www/html/public
    depends_on:
      - app
    networks:
      - app-network

  db:
    image: mysql:8.0
    container_name: mysql_db
    environment:
      MYSQL_ROOT_PASSWORD: root_secret
      MYSQL_DATABASE: docker_demo
      MYSQL_USER: docker_user
      MYSQL_PASSWORD: docker_pass
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
      timeout: 10s
      retries: 5
    networks:
      - app-network

volumes:
  db_data:

networks:
  app-network:
    driver: bridge
```

Mari kita bahas setiap layanan:

#### `app` (PHP-FPM)

- **build**: membangun image dari `Dockerfile` kita
- **environment**: mengirimkan kredensial database sebagai variabel lingkungan (dibaca oleh `getenv()` di `Database.php`)
- **depends_on**: menunggu MySQL sehat sebelum memulai
- **volumes**: memasang `./public` dan `./src` dari host ke dalam container, perubahan yang Anda buat secara lokal tercermin langsung (tidak perlu *rebuild*)

#### `web` (Nginx)

- **image**: menggunakan image Nginx Alpine resmi (5 MB, sangat kecil)
- **ports**: memetakan port host 8080 ke port container 80, lalu kunjungi `http://localhost:8080`
- **volumes**: memasang konfigurasi Nginx kita dan direktori `public/`

#### `db` (MySQL)

- **environment**: mengatur password root, membuat database dan pengguna
- **volumes**: `db_data` mempertahankan file database di antara *restart* container
- **healthcheck**: memberi tahu Docker cara memeriksa apakah MySQL sudah siap; `app` menunggu ini

### Langkah 5: Bangun dan jalankan

```bash
docker compose up -d
```

- `-d` menjalankan container dalam mode *detached* (latar belakang)

Docker akan:
1. Menarik image `nginx:alpine` dan `mysql:8.0`
2. Membangun image `app` dari `Dockerfile` kita
3. Membuat jaringan bridge `app-network` dan volume `db_data`
4. Memulai `db` terlebih dahulu, menunggu hingga sehat, lalu memulai `app` dan `web`

Periksa bahwa semuanya berjalan:

```bash
docker compose ps
```

Buka browser dan kunjungi `http://localhost:8080`. Anda seharusnya melihat:

```
Docker PHP + Nginx + MySQL
PHP 8.2.x sedang berjalan.
Berhasil terhubung ke MySQL!
Waktu server: 2026-07-13 14:30:00
```

### Langkah 6: Hentikan semuanya

```bash
docker compose down
```

Ini menghentikan dan menghapus semua container. Tambahkan `-v` untuk juga menghapus named volume (`db_data`):

```bash
docker compose down -v
```

### Perintah docker compose umum

```bash
docker compose up -d          # mulai layanan di latar belakang
docker compose down            # hentikan dan hapus semua layanan
docker compose ps              # daftar status layanan
docker compose logs app        # lihat log untuk layanan 'app'
docker compose logs -f         # ikuti semua log (seperti tail -f)
docker compose exec app bash   # buka shell di dalam container 'app'
docker compose restart app     # mulai ulang layanan 'app'
```

</section>

---

<section lang="en">

## Development Workflow

Running containers in production is one thing; developing with them day-to-day is another. Here are the patterns that make Docker a productivity multiplier, not a burden.

### Live Reload with Bind Mounts

In our `docker-compose.yml`, we already mounted `./public` and `./src` as volumes:

```yaml
volumes:
  - ./public:/var/www/html/public
  - ./src:/var/www/html/src
```

This means any change you make to a PHP file on your host is immediately visible inside the container. There is no need to rebuild the image for every code change — just save the file and refresh the browser.

> **Note**: If you change the `Dockerfile` (e.g., add a PHP extension) or `composer.json`, you *do* need to rebuild: `docker compose up -d --build`.

### Viewing Logs

```bash
docker compose logs -f app     # follow PHP-FPM logs
docker compose logs -f web     # follow Nginx access/error logs
docker compose logs -f db      # follow MySQL logs
docker compose logs -f         # follow all services
```

### Executing Commands Inside a Container

Need to run `composer install`, run a migration, or debug something? Use `docker compose exec`:

```bash
docker compose exec app bash           # open an interactive shell
docker compose exec app php -v         # check PHP version
docker compose exec app php -m         # list installed extensions
docker compose exec app composer install   # install dependencies
docker compose exec db mysql -u root -p    # connect to MySQL CLI
```

### Debugging Tips

**"Port already in use" error:**
If port 3306 or 8080 is already in use (likely by a local MySQL or another container), change the host port in `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"   # use 3307 on host
```

Then connect with `mysql -h 127.0.0.1 -P 3307`.

**"Cannot connect to MySQL" error:**
This usually means the `db` container isn't ready yet when `app` starts. The `healthcheck` in our compose file solves this — if you remove it, add `restart: on-failure` or a retry loop in your PHP code.

**Inspecting a container's state:**

```bash
docker inspect mysql_db              # full JSON metadata
docker compose exec db env           # see environment variables
docker compose exec app php -i       # phpinfo() from the command line
```

### Cleaning Up

Docker accumulates stopped containers, unused images, and dangling volumes over time. Clean them up periodically:

```bash
docker system prune           # remove stopped containers, unused networks, dangling images
docker system prune -a        # also remove all unused images (use with care)
docker volume prune           # remove unused volumes
```

### Dockerfile Best Practices

1. **Pin your base image version.** Use `php:8.2-fpm` instead of `php:latest` to avoid surprise upgrades.
2. **Combine RUN commands.** Each `RUN` creates a layer. Chain related commands with `&&`:

   ```dockerfile
   # Good
   RUN apt-get update && apt-get install -y \
       libpq-dev \
       && rm -rf /var/lib/apt/lists/*

   # Bad (three separate layers)
   RUN apt-get update
   RUN apt-get install -y libpq-dev
   RUN rm -rf /var/lib/apt/lists/*
   ```

3. **Use `.dockerignore`.** Prevent sending unnecessary files (`node_modules`, `.git`, `vendor`) to the build context. Create `.dockerignore`:

   ```
   .git
   node_modules
   vendor
   .env
   *.md
   ```

4. **Run as non-root.** By default, containers run as `root`. For production, switch to a non-privileged user:

   ```dockerfile
   USER www-data
   ```

5. **Use multi-stage builds** for production images to keep them small. The `COPY --from=composer:2` line in our Dockerfile is an example.

</section>

<section lang="id">

## Alur Kerja Pengembangan

Menjalankan kontainer di produksi adalah satu hal; mengembangkan dengannya sehari-hari adalah hal lain. Berikut adalah pola yang membuat Docker menjadi pengganda produktivitas, bukan beban.

### Live Reload dengan Bind Mounts

Di `docker-compose.yml` kita, kita sudah memasang `./public` dan `./src` sebagai volume:

```yaml
volumes:
  - ./public:/var/www/html/public
  - ./src:/var/www/html/src
```

Ini berarti setiap perubahan yang Anda buat pada file PHP di host langsung terlihat di dalam container. Tidak perlu membangun ulang image untuk setiap perubahan kode: cukup simpan file dan segarkan browser.

> **Catatan**: Jika Anda mengubah `Dockerfile` (misalnya, menambahkan ekstensi PHP) atau `composer.json`, Anda *perlu* membangun ulang: `docker compose up -d --build`.

### Melihat Log

```bash
docker compose logs -f app     # ikuti log PHP-FPM
docker compose logs -f web     # ikuti log akses/error Nginx
docker compose logs -f db      # ikuti log MySQL
docker compose logs -f         # ikuti semua layanan
```

### Menjalankan Perintah di Dalam Container

Perlu menjalankan `composer install`, menjalankan migrasi, atau men-debug sesuatu? Gunakan `docker compose exec`:

```bash
docker compose exec app bash           # buka shell interaktif
docker compose exec app php -v         # periksa versi PHP
docker compose exec app php -m         # daftar ekstensi yang terinstal
docker compose exec app composer install   # instal dependensi
docker compose exec db mysql -u root -p    # sambungkan ke MySQL CLI
```

### Tips Debugging

**Error "Port already in use":**
Jika port 3306 atau 8080 sudah digunakan (kemungkinan oleh MySQL lokal atau container lain), ubah port host di `docker-compose.yml`:

```yaml
ports:
  - "3307:3306"   # gunakan 3307 di host
```

Lalu sambungkan dengan `mysql -h 127.0.0.1 -P 3307`.

**Error "Cannot connect to MySQL":**
Ini biasanya berarti container `db` belum siap saat `app` dimulai. `healthcheck` di file compose kita menyelesaikan ini: jika Anda menghapusnya, tambahkan `restart: on-failure` atau *loop* percobaan ulang di kode PHP Anda.

**Memeriksa status container:**

```bash
docker inspect mysql_db              # metadata JSON lengkap
docker compose exec db env           # lihat variabel lingkungan
docker compose exec app php -i       # phpinfo() dari command line
```

### Membersihkan

Docker mengakumulasi container yang berhenti, image yang tidak digunakan, dan volume menggantung seiring waktu. Bersihkan secara berkala:

```bash
docker system prune           # hapus container berhenti, jaringan tidak terpakai, image menggantung
docker system prune -a        # juga hapus semua image tidak terpakai (gunakan dengan hati-hati)
docker volume prune           # hapus volume tidak terpakai
```

### Praktik Terbaik Dockerfile

1. **Pin versi image dasar Anda.** Gunakan `php:8.2-fpm` bukan `php:latest` untuk menghindari peningkatan mendadak.
2. **Gabungkan perintah RUN.** Setiap `RUN` membuat layer. Rantai perintah terkait dengan `&&`:

   ```dockerfile
   # Baik
   RUN apt-get update && apt-get install -y \
       libpq-dev \
       && rm -rf /var/lib/apt/lists/*

   # Buruk (tiga layer terpisah)
   RUN apt-get update
   RUN apt-get install -y libpq-dev
   RUN rm -rf /var/lib/apt/lists/*
   ```

3. **Gunakan `.dockerignore`.** Cegah pengiriman file yang tidak perlu (`node_modules`, `.git`, `vendor`) ke konteks *build*. Buat `.dockerignore`:

   ```
   .git
   node_modules
   vendor
   .env
   *.md
   ```

4. **Jalankan sebagai non-root.** Secara default, container berjalan sebagai `root`. Untuk produksi, beralih ke pengguna *non-privileged*:

   ```dockerfile
   USER www-data
   ```

5. **Gunakan multi-stage build** untuk image produksi agar tetap kecil. Baris `COPY --from=composer:2` di Dockerfile kita adalah contohnya.

</section>

---

<section lang="en">

## From Container to Microservices

Now that you understand Docker fundamentals, you are ready to explore **microservices architecture** — a design approach where an application is built as a collection of small, independent services, each running in its own container and communicating over the network.

The Docker concepts you learned here are the building blocks of that tutorial:

- **Dockerfiles** define each microservice's runtime environment
- **docker-compose** orchestrates all microservices together for local development
- **Service names as hostnames** (`db`, `web`, `app`) are exactly how microservices discover each other
- **Volumes** and **networks** isolate state and communication between services

The [Microservices Architecture Fundamentals with PHP](/blog/microservices-architecture-fundamentals) tutorial walks you through decomposing a monolithic PHP application into separate services (User Service, Product Service, Order Service) with an API Gateway, message queues, and service discovery — all running in Docker containers.

> If you haven't already, now is the perfect time to work through that tutorial. You already understand the container concepts it assumes.

If you want to go even deeper, explore:

- **Docker Swarm** or **Kubernetes** — for orchestrating containers across multiple machines in production
- **GitHub Container Registry (GHCR)** — for storing and distributing your Docker images alongside your code
- **[CI/CD with GitHub Actions for PHP](/blog/ci-cd-github-actions-php)** — where containers are built and tested automatically on every push

</section>

<section lang="id">

## Dari Kontainer ke Microservices

Sekarang setelah Anda memahami dasar-dasar Docker, Anda siap untuk menjelajahi **arsitektur microservices**: pendekatan desain di mana aplikasi dibangun sebagai kumpulan layanan kecil dan independen, masing-masing berjalan di kontainernya sendiri dan berkomunikasi melalui jaringan.

Konsep Docker yang Anda pelajari di sini adalah blok bangunan dari tutorial tersebut:

- **Dockerfiles** mendefinisikan lingkungan *runtime* setiap microservice
- **docker-compose** mengorkestrasi semua microservice bersama untuk pengembangan lokal
- **Nama layanan sebagai hostname** (`db`, `web`, `app`) adalah persis cara microservice saling menemukan satu sama lain
- **Volumes** dan **networks** mengisolasi *state* dan komunikasi antar layanan

Tutorial [Microservices Architecture Fundamentals dengan PHP](/blog/microservices-architecture-fundamentals) memandu Anda mendekomposisi aplikasi PHP monolitik menjadi layanan terpisah (User Service, Product Service, Order Service) dengan API Gateway, *message queue*, dan *service discovery*, semuanya berjalan di kontainer Docker.

> Jika Anda belum melakukannya, sekarang adalah waktu yang tepat untuk mengerjakan tutorial tersebut. Anda sudah memahami konsep kontainer yang diasumsikannya.

Jika Anda ingin lebih mendalam, jelajahi:

- **Docker Swarm** atau **Kubernetes**: untuk mengorkestrasi kontainer di banyak mesin di produksi
- **GitHub Container Registry (GHCR)**: untuk menyimpan dan mendistribusikan image Docker Anda bersama kode Anda
- **[CI/CD dengan GitHub Actions untuk PHP](/blog/ci-cd-github-actions-php)**: di mana kontainer dibangun dan diuji secara otomatis pada setiap *push*

</section>

---

<section lang="en">

## Summary

Docker and containerization are no longer optional skills for PHP developers — they are foundational. In this tutorial you learned:

1. **Why containers solve reproducibility.** No more "it works on my machine" — the same image runs identically everywhere.
2. **How to install Docker** on Windows, macOS, and Linux.
3. **The six core concepts** — image, container, layer, registry, Dockerfile, and docker-compose — and how they relate.
4. **How to containerize a PHP script** with a simple `Dockerfile`.
5. **How to build a multi-service stack** with PHP-FPM, Nginx, and MySQL using `docker-compose.yml`.
6. **Development workflow patterns** — bind mounts for live reload, `docker compose exec` for debugging, and cleanup commands.
7. **How Docker bridges to microservices** — each container is a step toward a distributed architecture.

</section>

<section lang="id">

## Ringkasan

Docker dan kontainerisasi bukan lagi keterampilan opsional bagi pengembang PHP, melainkan sudah menjadi keterampilan fundamental. Dalam tutorial ini Anda mempelajari:

1. **Mengapa kontainer menyelesaikan reproduksibilitas.** Tidak ada lagi "di komputer saya berfungsi": image yang sama berjalan identik di mana saja.
2. **Cara menginstal Docker** di Windows, macOS, dan Linux.
3. **Enam konsep inti** (image, container, layer, registry, Dockerfile, dan docker-compose) dan bagaimana mereka saling berhubungan.
4. **Cara mengontainerisasi skrip PHP** dengan `Dockerfile` sederhana.
5. **Cara membangun stack multi-layanan** dengan PHP-FPM, Nginx, dan MySQL menggunakan `docker-compose.yml`.
6. **Pola alur kerja pengembangan**: *bind mount* untuk *live reload*, `docker compose exec` untuk *debugging*, dan perintah pembersihan.
7. **Bagaimana Docker menjembatani ke microservices**: setiap kontainer adalah langkah menuju arsitektur terdistribusi.

</section>

---

<blockquote>
  <span lang="en">**What to Read Next:** [Microservices Architecture Fundamentals with PHP](/blog/microservices-architecture-fundamentals) — apply your container skills to decompose a monolith into independently deployable services with API gateways and inter-service communication.</span>
  <span lang="id">**Yang Harus Dibaca Selanjutnya:** [Dasar-Dasar Arsitektur Microservices dengan PHP](/blog/microservices-architecture-fundamentals) — terapkan keterampilan kontainer Anda untuk mendekomposisi monolith menjadi layanan yang dapat di-deploy secara independen dengan API gateway dan komunikasi antar layanan.</span>
</blockquote>
