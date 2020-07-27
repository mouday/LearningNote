# 第35 章 ： 网络编程
## 152 网络编程简介
网络编程: 多台主机之间的数据通信
通信协议：IP、TCP（可靠数据连接）、UDP（不可靠数据连接）
网络程序模型:
C/S Client/Server 客户端/服务端 安全性高 开发成本高
B/S Browser/Server 浏览器/服务器 安全性较低  开发成本低

目前以B/S 结构为主

## 153 Echo程序模型
ServerSocket与Socket
ServerSocket 设置服务器监听端口
Socket 设置要连接服务器的ip和端口

实现一个客户端与服务器端通信 Echo服务
Server.java
```java
import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

public class Server {
    public static void main(String[] args) throws IOException {
        // 设置服务器监听端口
        ServerSocket server = new ServerSocket(8080);
        System.out.println("服务启动。。。");

        // 接收客户端连接
        Socket client = server.accept();

        // 接收客户端消息
        Scanner scanner = new Scanner(client.getInputStream());
        scanner.useDelimiter("\n");

        // 发送给客户端数据
        PrintWriter out = new PrintWriter(client.getOutputStream());

        // 结束标志
        boolean flag = true;

        while (flag) {
            if (scanner.hasNext()) {
                // 读取客户端数据
                String message = scanner.next();
                System.out.println("收到: " + message);

                // 结束标志
                if ("bye".equalsIgnoreCase(message)) {
                    flag = false;
                }

                // 发送数据给客户端
                out.println("[echo] " + message);
                out.flush();
            }
        }

        // 关闭
        out.close();
        scanner.close();
        client.close();
        server.close();
    }
}

```

Client.java
```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.Socket;
import java.util.Scanner;

public class Client {
    private final static BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));

    public static void main(String[] args) throws IOException {
        // 连接服务器
        Socket client = new Socket("localhost", 8080);

        // 接收服务器信息
        Scanner scanner = new Scanner(client.getInputStream());
        scanner.useDelimiter("\n");

        // 向服务器发送信息
        PrintWriter out = new PrintWriter(client.getOutputStream());

        // 结束标志
        boolean flag = true;

        while (flag) {
            // 读取控制台输入，发送给服务器
            String message = getInput("请输入：");
            System.out.println("发送：" + message);
            out.println(message);
            out.flush();

            // 接收服务端返回的数据
            if (scanner.hasNext()) {
                System.out.println("返回：" + scanner.next());
            }

            // 结束标志
            if ("bye".equalsIgnoreCase(message)) {
                flag = false;
            }
        }

        // 关闭操作
        out.close();
        scanner.close();
        client.close();

    }

    // 接收控制台输入
    public static String getInput(String prompt) throws IOException {
        System.out.println(prompt);
        return reader.readLine();
    }
}

```

## 154 BIO处理模型
多线程接收多个客户端连接

只用修改服务端代码
Server.java
```java
import java.io.IOException;
import java.io.PrintWriter;
import java.net.ServerSocket;
import java.net.Socket;
import java.util.Scanner;

public class Server {

    public static class ClientThread implements Runnable {
        private Socket client = null;
        private Scanner scanner = null;
        private PrintWriter out = null;
        private boolean flag = true; // 结束标志

        ClientThread(Socket client) throws IOException {
            this.client = client;
            // 接收客户端消息
            this.scanner = new Scanner(client.getInputStream());
            this.scanner.useDelimiter("\n");

            // 发送给客户端数据
            this.out = new PrintWriter(client.getOutputStream());
        }

        @Override
        public void run() {
            while (this.flag) {
                if (this.scanner.hasNext()) {
                    // 读取客户端数据
                    String message = this.scanner.next();
                    System.out.println("收到: " + Thread.currentThread() + message);

                    // 结束标志
                    if ("bye".equalsIgnoreCase(message)) {
                        this.flag = false;
                    }

                    // 发送数据给客户端
                    this.out.println("[echo] " + message);
                    this.out.flush();
                }
            }
            this.out.close();
            this.scanner.close();
            try {
                this.client.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static void main(String[] args) throws IOException {
        // 设置服务器监听端口
        ServerSocket server = new ServerSocket(8080);
        System.out.println("服务启动。。。");

        while (true) {
            // 接收客户端连接
            Socket client = server.accept();
            new Thread(new ClientThread(client)).start();
        }

        // 关闭
        // server.close();
    }
}

```

## 155 UDP程序
UDP 基于数据报实现
TCP要保证可靠连接，需要的服务器资源就多

不管客户端是否接收到

Receiver.java
```java
import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;

public class Receiver {

    public static void main(String[] args) throws IOException {
        DatagramSocket receiver = new DatagramSocket(9000);

        byte[] data = new byte[2014];
        DatagramPacket packet = new DatagramPacket(data, data.length);

        // 等待接收数据
        receiver.receive(packet);
        System.out.println(new String(data, 0, packet.getLength()));

        // 关闭
        receiver.close();
    }

}

```

Sender.java
```java
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class Sender {
    public static void main(String[] args) throws Exception {
        DatagramSocket sender = new DatagramSocket(9001);

        // 发送数据
        String message = "Hello world";
        DatagramPacket packet = new DatagramPacket(message.getBytes(), 0, message.length(), InetAddress.getByName("localhost"), 9000);
        sender.send(packet);

        // 关闭
        sender.close();

    }
}

```



