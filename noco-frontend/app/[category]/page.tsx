"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import axiosInstance from '@/axios/axiosMiddleware';
import { AnyNode } from "postcss";
import {Divider} from "@nextui-org/divider";
import {
  Card, 
  CardHeader, 
  CardBody, 
  Image, 
  Modal, 
  ModalContent, 
  ModalHeader, 
  ModalBody, ModalFooter, 
  Button, 
  User,
  useDisclosure,
  Input,
  Textarea,
  Dropdown, 
  DropdownTrigger, 
  DropdownMenu, 
  DropdownItem
} from "@nextui-org/react";

interface Table {
  id: string;
  source_id: string;
  base_id: string;
  table_name: string;
  title: string;
  type: string;
  meta: {
    hasNonDefaultViews: boolean;
  };
  schema: null;
  enabled: boolean;
  mm: boolean;
  tags: null;
  pinned: null;
  deleted: null;
  order: number;
  created_at: string;
  updated_at: string;
  description: null;
}

interface Row {
  Code: string; //Unique Identifier
  Id: string;
  Title: string;
  Content: string;
  CreatedBy: {
    display_name: string;
    email: string;
    id: string;
  }
  CreatedAt: string;
  UpdatedAt: string;
  Image: Array<AnyNode>;
}

interface TableRecord {
  table: string;
  record: Row[];  
}

interface Category {
  main: string;
  subs: Array<string>;
}

export default function Category({ params }: { params: { category: string } }) {

  const [records, setRecords] = useState<TableRecord[]>([]);
  const [activeModalId, setActiveModalId] = useState(null);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Local"]));
   
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const handleOpenModal = (id) => {
    setActiveModalId(id);
  };
  
  const handleCloseModal = () => {
    setActiveModalId(null);
  };

  useEffect(() => {
    const fetchBaseInfo = async () => {
      try {
        const tempCategories: Array<Category> = [];

        const bases = await axiosInstance.get('/meta/bases');
        for (let cat of bases.data.list) {
          const temp: Category = {
            main: cat.title,
            subs: [],
          }
          const subs = await axiosInstance.get(`/meta/bases/${cat.id}/tables`);
          for (let sub of subs.data.list) {
            temp.subs.push(sub.title);
          }
          tempCategories.push(temp);
        }
        console.log(tempCategories);
        setCategories(tempCategories);

        const baseResponse = await axiosInstance.get(`/meta/bases/${params.category}`);
        setCategory(baseResponse.data.title);
      }
      catch (error) {
        console.error("Failed to fetch base info: ", error);
      }
    }

    fetchBaseInfo();

    const tableRecords: TableRecord[] = [];
    const fetchTables = async () => {
        try {
            const tablesResponse = await axiosInstance.get(`/meta/bases/${params.category}/tables`);
            const tables: Table[] = tablesResponse.data.list;

            const fetchData = tables.map(async (table) => {
              const dataResponse = await axiosInstance.get(`/tables/${table.id}/records`);
              tableRecords.push({
                "table": table.title,
                "record": dataResponse.data.list,
              })
            });

            await Promise.all(fetchData);
            setRecords(tableRecords);
        }
        catch (error) {
            console.error("Failed to fetch tables: ", error);
        }
    }

    fetchTables();
  }, [])

  return (
    <div className="ml-96">
      <div className="text-4xl mt-4">{category}</div>
      <Divider className="my-4" />
      {records.map((record) => (
        <div className="flex" key={record.table}>
          {record.record.map((row) => (
            <div key={row.Code}>
              <Button onPress={() => handleOpenModal(row.Code)} variant="light" className="h-fit w-fit bg-transparent p-0 m-0 border-0 hover:bg-transparent">
                <Card className="py-4 cursor-pointer hover:scale-105 m-2">
                  <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                    <p className="text-tiny uppercase font-bold">{row.Title}</p>
                    <small className="text-default-500">{row.CreatedAt}</small>
                    <h4 className="font-bold text-large">{record.table}</h4>
                  </CardHeader>
                  <CardBody className="overflow-visible py-2">
                    <Image
                      alt="Card background"
                      className="object-cover rounded-xl"
                      src="https://nextui.org/images/hero-card-complete.jpeg"
                      width={270}
                    />
                  </CardBody>
                </Card>
              </Button>
              <Modal isOpen={activeModalId === row.Code} onOpenChange={() => setActiveModalId(null)} scrollBehavior="inside" size="2xl">
                <ModalContent>
                  <>
                    <ModalHeader className="flex flex-col gap-1">{row.Title}</ModalHeader>
                    <ModalBody>
                      <p> 
                        {row.Content}
                      </p>
                      <div>
                        <p className="text-tiny uppercase font-bold mb-2">Written By</p>
                        <User   
                          name={row.CreatedBy.email}
                          description="Editor"
                          avatarProps={{
                            src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
                          }}
                        />
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={handleCloseModal}>
                        Close
                      </Button>
                    </ModalFooter>
                  </>
                </ModalContent>
              </Modal>
              <div></div>
            </div>
          ))}
        </div>
      ))}
      <div className="fixed bottom-10 right-10">
        <Button onPress={onOpen} color="primary" radius="lg" className="w-20 h-20 text-4xl">
          +
        </Button>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">New Article</ModalHeader>
                <ModalBody>
                  <div>Select Category</div>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button 
                        variant="bordered" 
                      >
                        {selectedKeys}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Category Select" items={categories} disallowEmptySelection selectionMode="single" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                      {(category) => (
                        <DropdownItem
                          key={category.main}
                        >
                          {category.main}
                        </DropdownItem>
                      )}
                    </DropdownMenu>
                  </Dropdown>

                  <Input
                    autoFocus
                    label="Sub-category"
                    placeholder="Enter a sub-category"
                    variant="bordered"
                  />

                  <Input
                    autoFocus
                    label="Code"
                    placeholder="Enter a code - e.g. POL001"
                    variant="bordered"
                  />
                  <Input
                    label="Title"
                    placeholder="Enter a title"
                    variant="bordered"
                  />
                  <Textarea
                    label="Content"
                    placeholder="Enter article content"
                  />
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="light" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" onPress={onClose}>
                    Create
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
    </div>
  );
}