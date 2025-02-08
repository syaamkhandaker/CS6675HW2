# CS 6675 HW 2: Peer-to-Peer systems

## Source code

https://github.com/syaamkhandaker/CS6675HW2

## Problem

I did problem 1 option 1 of trying to make a toy peer to peer server that connects with at least 5 peers. Each of these 5 peers can store at most 5 different files and can share them amongst each other.

## How to run this:

### Note: You need to have Node version 20.x.x to run the code properly

To properly run this, you can run the startup.sh shell script provided. This command installs all dependencies needed using npm and creates a running instance of a peerjs server. With this now setup, you simply need to run a local development version of the website on a localhost url. In this system, each peer is generated by a separate browser tab. Within each tab, you're able to initalize a new "peer" that you can upload files to.

### To go through the proper flow of how to create a peer to peer system using my website, you can follow the following steps:

1. Log in using a peer id of your choice
2. Connect to other peers that are active by typing in their peer id. You can connect to as many as you want!
3. Upload at most 5 files to the file upload area. This is restricted to 5 but can be changed within common.ts.
4. From any peer you can input queries that represent file names of files uploaded in other peers. In other words, you can search for files that are already uploaded in other peers. The current system checks to see if the entire query matches the filename without the extension (e.g. test.txt -> test).
5. When it finishes searching through all peers, the timestamp for how long it took and a blob url is returned to the user. Using the blob url, any peer is able to download another peer's file.

## Screen shots:

Home page with entered queries:
![img1](https://github.com/user-attachments/assets/0dcefea6-04a4-484f-9b2b-043bf6058710)

Home page after query finished:
![img2](https://github.com/user-attachments/assets/ffb9e955-6ec4-4f74-b8c3-3e7b0e7e4599)

Sample Blob Page:
![img3](https://github.com/user-attachments/assets/b988a277-b636-4fcf-a12d-3b8b5392b954)


Routing functionalities:
The way this system routes requests is by a BFS structure. The first peer checks its neighbors to see if any of them matches the query. If none of those neighbors match, then it gets forwarded to the neighbor's neighbor, until it eventually finds a match. This BFS structure is extremely key to ensure that this system is peer to peer.

## Measurements:

#### Baseline:

- Latency: On average it took 7 ms/query for a 1Mb byte file
- Throughput: On average approximately 170 consecutive queries were finished in one second (170 queries/sec)

#### Proposed Routing Protocol:

I chose option 2.2 and varied queries from 10, 20, and 40 with a fixed number of files of 10 for each of the 5 peers.

10 queries:

- Latency: 5 ms/query
- Throughput: 10 queries/48ms or 208.3 queries/s

20 queries:

- Latency: 4.5 ms/query
- Throughput: 20 queries/90ms or 222 queries/s

40 queries:

- Latency: 4.6 ms/query
- Throughput: 40 queries/184ms or 217.3 queries/s

## Discussion
It's interesting to see that the times are staying pretty constant for every interval increase of queries. My initial expectation was that as you increase the amount of queries, the system will get overloaded even more, causing the throughput to decrease and the latency to increase. However, that is not the case. Within the alternative systems, I found that the 20 query option to marginally be the best because of its fastest latency time and highest throughput.

## Scalability:

Given the system was built as a web app, there are a lot of perks such as being super easy to scale this product to others. Many people are able to access this url at the same time. However, mainly where it falls of at is how fast people are able to query their requests. The latency that we achieved was with files that were only around 1 Mb big. This means that if we had much bigger files in the gigabyte range, it would take much more significant time to query. Therefore, my service is not extremely scalable for a large population of users who are uploading large files. Instead, this system is more meant for a few users who are hoping to share a small amount of files amongst each other. One other big concern is with how Typescript and Javascript are fundamentally single threaded, meaning simultaneous actions would probably take a while.

## Reliability:

A lot of my peer to peer system seems to be reliable due to a lot of guardrails in place. In addition, the website is developed in a way that is super self-explanatory and easy to use- to make this a priority, instructions are even provided above the textfields and buttons. Some fallbacks with the design though mainly deal with small features that were left out. For one, the error checking is done somewhat minimally. In other words, only the main errors are covered and shown through a status popup. One of the other big concerns deal with how bigger files take considerably longer to retrieve. This makes it less reliable to retrieve data super quickly.

## Anonymity:

This service's anonymity depends on what type of data or tracking that peerjs might be doing. In addition to that, with the dependency, some developers are able to see all open connections currently, events that happened for closed peers, and are able close listening services. However, all of this really depends on how well the website gets deployed on the internet. In the case that lots of security protocols are in place, we'll have a high chance that every user is anonymous. In the case that the deployment isn't super secure, hackers and other developers can probably more easily take advantage of peerjs and attempt to exploit the services.
