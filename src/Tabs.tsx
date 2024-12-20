import { useState, useCallback, useEffect } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { Category, Post } from "./data";

export function Tabs() {
  const [activeTabId, setActiveTabId] = useState<string>("1");
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<Record<string, Post[]>>({});

  const handleTabClick = useCallback(
    (index: number) => {
      const tabId = categories[index].id;
      setActiveTabId(tabId);
    },
    [categories]
  );

  useEffect(() => {
    let shouldFetch = true;
    const getCategories = async () => {
      if (!shouldFetch) return;

      const response = await fetch("http://localhost:3010/categories");
      const nextCats: Category[] = await response.json();

      if (shouldFetch) {
        setCategories(nextCats);
      }
    };

    if (!categories.length) {
      getCategories();
    }

    return () => {
      shouldFetch = false;
    };
  }, [categories]);

  useEffect(() => {
    let shouldFetch = true;
    const getPostsFromCategory = async (tabId: string) => {
      if (!categories.length) return;

      const response = await fetch(
        `http://localhost:3010/posts?category=${activeTabId}`
      );
      const catPosts: Post[] = await response.json();

      setPosts((prevPosts) => {
        if (!posts[tabId]) {
          return {
            [tabId]: catPosts,
          };
        } else {
          const postsArray = Array.from(Object.entries(prevPosts)).map(
            ([id, posts]) => {
              console.log(id, posts);
              if (id === tabId) {
                console.log(id, tabId, catPosts);
                return [id, catPosts];
              }

              return [id, posts];
            }
          );

          return Object.fromEntries(postsArray);
        }
      });
    };

    if (activeTabId && shouldFetch && !posts[activeTabId]?.length) {
      getPostsFromCategory(activeTabId);
    }

    return () => {
      shouldFetch = false;
    };
  }, [activeTabId, categories, posts]);

  return (
    <div className="flex h-screen w-full justify-center pt-24 px-4">
      <div className="w-full max-w-md">
        <TabGroup onChange={handleTabClick}>
          <TabList className="flex gap-4">
            {categories.map(({ name }) => (
              <Tab
                key={name}
                className="rounded-full py-1 px-3 text-sm/6 font-semibold text-white focus:outline-none data-[selected]:bg-white/10 data-[hover]:bg-white/5 data-[selected]:data-[hover]:bg-white/10 data-[focus]:outline-1 data-[focus]:outline-white"
              >
                {name}
              </Tab>
            ))}
          </TabList>
          <TabPanels className="mt-3">
            {categories.map(({ id, name }) => (
              <TabPanel key={name} className="rounded-xl bg-white/5 p-3">
                <ul>
                  {posts[id]?.map((post) => (
                    <li
                      key={post.id}
                      className="relative rounded-md p-3 text-sm/6 transition hover:bg-white/5"
                    >
                      <a href="/" className="font-semibold text-white">
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                      <ul
                        className="flex gap-2 text-white/50"
                        aria-hidden="true"
                      >
                        <li>{post.date}</li>
                        <li aria-hidden="true">&middot;</li>
                        <li>{post.commentCount} comments</li>
                        <li aria-hidden="true">&middot;</li>
                        <li>{post.shareCount} shares</li>
                      </ul>
                    </li>
                  ))}
                </ul>
              </TabPanel>
            ))}
          </TabPanels>
        </TabGroup>
      </div>
    </div>
  );
}
