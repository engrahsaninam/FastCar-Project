import React, { useState, ChangeEvent, DragEvent } from 'react';
import {
    Box,
    Flex,
    Text,
    Button,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Select,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Badge,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    FormControl,
    FormLabel,
    VStack,
    HStack,
    useToast,
    Image,
    Grid,
    GridItem,
    Stat,
    StatLabel,
    StatNumber,
    StatHelpText,
    StatArrow,
    Textarea,
    // ChakraImage,
} from '@chakra-ui/react';
import {
    // FiCar,
    FiPackage,
    FiDollarSign,
    FiCalendar,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiRefreshCw,
    FiX,
    FiSearch,
    FiBell,
    FiEye,
    FiSettings,
    FiUsers,
    FiLayout,
    FiImage,
} from 'react-icons/fi';
import { useAuth } from './auth-components';
import DashboardOverview from './DashboardOverview';
import RecentOrders from './RecentOrders';
import VehiclesTable from './VehiclesTable';
import OrdersTable from './OrdersTable';
import { Vehicle, Order, Stats, FinancingEntry } from './types';
import FinancingTable from './FinancingTable';
import FinancingDetailsModal from './FinancingDetailsModal';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [vehicles, setVehicles] = useState<Vehicle[]>([
        {
            id: 1,
            name: "Mercedes-Benz A 200 d",
            power: "110 kW",
            basePrice: 634490,
            priceWithoutVAT: 447915,
            services: {
                carAudit: 1990,
                homeDelivery: 15005,
                importMOT: 4490,
                adminFee: 800,
                registration: 1990,
            }
        }
    ]);

    const [orders, setOrders] = useState<Order[]>([
        {
            id: "ORD-2024-001",
            vehicle: "Mercedes-Benz A 200 d",
            customer: "John Doe",
            customerEmail: "john@example.com",
            customerPhone: "+34 123 456 789",
            status: "Pending",
            totalPrice: 647765,
            services: ["Home Delivery", "Import MOT"],
            date: "2024-03-20",
            paymentStatus: "Paid",
            deliveryAddress: "123 Main St, Madrid, Spain",
            notes: "",
            timeline: [
                { status: "Order Placed", date: "2024-03-20", time: "10:30" },
                { status: "Payment Received", date: "2024-03-20", time: "11:45" }
            ]
        }
    ]);

    const [stats, setStats] = useState<Stats>({
        totalVehicles: 194475,
        activeOrders: 45,
        totalRevenue: 15789650,
        pendingDeliveries: 12
    });

    const { isOpen: isAddVehicleOpen, onOpen: onAddVehicleOpen, onClose: onAddVehicleClose } = useDisclosure();
    const { isOpen: isOrderDetailsOpen, onOpen: onOrderDetailsOpen, onClose: onOrderDetailsClose } = useDisclosure();
    const { isOpen: isFinancingDetailsOpen, onOpen: onFinancingDetailsOpen, onClose: onFinancingDetailsClose } = useDisclosure();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedFinancingApplication, setSelectedFinancingApplication] = useState<FinancingEntry | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderFilter, setOrderFilter] = useState('all');
    const { user, logout } = useAuth();
    const toast = useToast();

    // Dummy data for FinancingTable
    const [financingData, setFinancingData] = useState<FinancingEntry[]>([
        {
            name: "Jane",
            surname: "Smith",
            telephoneNumber: "+34 987 654 321",
            email: "jane.smith@example.com",
            identificationNumber: "XYZ789012",
            dateOfBirth: "1992-07-25",
            totalFinancedAmount:12323,
            totalKm:1123,
            color:"red"
        },
        {
            name: "Peter",
            surname: "Jones",
            telephoneNumber: "+44 20 7123 4567",
            email: "peter.jones@example.com",
            identificationNumber: "AB123456C",
            dateOfBirth: "1985-11-10",
            totalFinancedAmount: 12323,
            totalKm: 1123,
            color: "red"
        },
    ]);

    const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order => {
                if (order.id === orderId) {
                    const timeline = [
                        ...order.timeline,
                        {
                            status: newStatus,
                            date: new Date().toISOString().split('T')[0],
                            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                        }
                    ];
                    return { ...order, status: newStatus, timeline };
                }
                return order;
            })
        );
    };

    const handleDeleteOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
            toast({
                title: 'Order deleted',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleCancelOrder = (orderId: string) => {
        if (window.confirm('Are you sure you want to cancel this order?')) {
            handleUpdateOrderStatus(orderId, 'Cancelled');
            toast({
                title: 'Order cancelled',
                status: 'info',
                duration: 3000,
                isClosable: true,
            });
        }
    };

    const handleApproveFinancing = (applicationId: string) => {
        console.log(`Application ${applicationId} approved`);
        // Implement actual approval logic here
        onFinancingDetailsClose();
    };

    const handleRejectFinancing = (applicationId: string) => {
        console.log(`Application ${applicationId} rejected`);
        // Implement actual rejection logic here
        onFinancingDetailsClose();
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = (
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.vehicle.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesFilter = orderFilter === 'all' || order.status.toLowerCase() === orderFilter.toLowerCase();
        return matchesSearch && matchesFilter;
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'yellow';
            case 'processing':
                return 'blue';
            case 'completed':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'gray';
        }
    };

    return (
        <Box minH="100vh" bg="gray.50">
            {/* Top Navigation */}
            <Box bg="white" borderBottom="1px" borderColor="gray.200">
                <Flex justify="space-between" align="center" px={6} py={3}>
                    <Flex align="center" gap={4}>
                        {/* <Image src="/Logo/logo.png.png" alt="Logo" h="12" /> */}
                        <Text fontSize="xl" fontWeight="bold" color="gray.800">Admin Dashboard</Text>
                    </Flex>
                    <Flex align="center" gap={4}>
                        <IconButton
                            aria-label="Notifications"
                            icon={<FiBell />}
                            variant="ghost"
                            position="relative"
                        >
                            <Box
                                position="absolute"
                                top="0"
                                right="0"
                                w="2"
                                h="2"
                                bg="red.500"
                                borderRadius="full"
                            />
                        </IconButton>
                        <Flex align="center" gap={2}>
                            <Text fontSize="sm" fontWeight="medium" color="black">
                                {user?.email || 'Admin'}
                            </Text>
                            <Button
                                size="sm"
                                colorScheme="red"
                                variant="ghost"
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </Box>

            {/* Main Content */}
            <Flex>
                {/* Sidebar */}
                <Box w="64" bg="white" h="calc(100vh - 4rem)" borderRight="1px" borderColor="gray.200">
                    <VStack spacing={1} p={4}>
                        {[
                            { id: 'dashboard', icon: FiLayout, label: 'Dashboard' },
                            { id: 'vehicles', icon: FiLayout, label: 'Vehicles' },
                            { id: 'orders', icon: FiPackage, label: 'Orders' },
                            { id: 'pricing', icon: FiDollarSign, label: 'Pricing' },
                            { id: 'financing', icon: FiDollarSign, label: 'Financing' },
                        ].map((item) => (
                            <Button
                                key={item.id}
                                w="full"
                                justifyContent="flex-start"
                                leftIcon={<item.icon />}
                                colorScheme={activeTab === item.id ? 'red' : 'black'}
                                variant={activeTab === item.id ? 'solid' : 'ghost'}
                                onClick={() => setActiveTab(item.id)}
                            >
                                {item.label}
                            </Button>
                        ))}
                    </VStack>
                </Box>

                {/* Main Content Area */}
                <Box flex="1" p={8}>
                    {activeTab === 'dashboard' && (
                        <VStack spacing={6} align="stretch">
                            <DashboardOverview stats={stats} />
                            <RecentOrders orders={orders} />
                        </VStack>
                    )}

                    {activeTab === 'vehicles' && (
                        <Box>
                            <Flex justify="space-between" align="center" mb={6}>
                                <HStack spacing={4}>
                                    <InputGroup color='black'>
                                        <InputLeftElement pointerEvents="none">
                                            <FiSearch />
                                        </InputLeftElement>
                                        <Input
                                            placeholder="Search vehicles..."
                                            value={searchTerm}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                    <Select placeholder="All Brands">
                                        <option>Mercedes-Benz</option>
                                        <option>BMW</option>
                                        <option>Audi</option>
                                    </Select>
                                </HStack>
                                <Button
                                    leftIcon={<FiPlus />}
                                    colorScheme="red"
                                    onClick={onAddVehicleOpen}
                                >
                                    Add Vehicle
                                </Button>
                            </Flex>

                            <VehiclesTable
                                vehicles={vehicles}
                                onEdit={(vehicle: Vehicle) => {
                                    // Handle edit
                                }}
                                onDelete={(vehicleId: number) => {
                                    // Handle delete
                                }}
                                onViewServices={(vehicle: Vehicle) => {
                                    // Handle view services
                                }}
                            />
                        </Box>
                    )}

                    {activeTab === 'orders' && (
                        <Box>
                            <Flex justify="space-between" align="center" mb={6}>
                                <HStack spacing={4}>
                                    <InputGroup color='black'>
                                        <InputLeftElement pointerEvents="none">
                                            <FiSearch />
                                        </InputLeftElement>
                                        <Input
                                            color='black'
                                            placeholder="Search orders..."
                                            value={searchTerm}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                        />
                                    </InputGroup>
                                    <Select
                                        value={orderFilter}
                                        onChange={(e: ChangeEvent<HTMLSelectElement>) => setOrderFilter(e.target.value)}
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </Select>
                                </HStack>
                            </Flex>

                            <OrdersTable
                                orders={filteredOrders}
                                onViewDetails={(order: Order) => {
                                    setSelectedOrder(order);
                                    onOrderDetailsOpen();
                                }}
                                onUpdateStatus={handleUpdateOrderStatus}
                                onCancel={handleCancelOrder}
                            />
                        </Box>
                    )}

                    {activeTab === 'pricing' && (
                        <Box bg="white" p={6} borderRadius="lg" shadow="sm">
                            <Text fontSize="lg" fontWeight="bold" mb={4} color='black'>Service Pricing</Text>
                            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                {Object.entries(vehicles[0].services).map(([service, price]) => (
                                    <Box key={service} p={4} borderWidth="1px" borderRadius="lg">
                                        <Flex justify="space-between" align="center">
                                            <Text color="black" textTransform="capitalize">
                                                {service.replace(/([A-Z])/g, ' $1').trim()}
                                            </Text>
                                            <Text fontWeight="medium" color="gray.800">CZK {price.toLocaleString()}</Text>
                                        </Flex>
                                        <Button
                                            size="sm"
                                            colorScheme="red"
                                            variant="ghost"
                                            mt={2}
                                        >
                                            Edit Price
                                        </Button>
                                    </Box>
                                ))}
                            </Grid>
                        </Box>
                    )}

                    {activeTab === 'financing' && (
                        <Box>
                            <FinancingTable data={financingData} onRowClick={(application) => {
                                setSelectedFinancingApplication(application);
                                onFinancingDetailsOpen();
                            }} />
                        </Box>
                    )}
                </Box>
            </Flex>

            {/* Modals */}
            <AddVehicleModal
                isOpen={isAddVehicleOpen}
                onClose={onAddVehicleClose}
                setVehicles={setVehicles}
            />

            <Modal isOpen={isOrderDetailsOpen} onClose={onOrderDetailsClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Order Details - {selectedOrder?.id}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        {selectedOrder && (
                            <VStack spacing={6} align="stretch">
                                {/* Customer Information */}
                                <Box>
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>Customer Information</Text>
                                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                        <Box>
                                            <Text fontSize="sm" color="black">Name</Text>
                                            <Text fontWeight="medium" color="gray.800">{selectedOrder.customer}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="black">Email</Text>
                                            <Text fontWeight="medium" color="gray.800">{selectedOrder.customerEmail}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="black">Phone</Text>
                                            <Text fontWeight="medium" color="gray.800">{selectedOrder.customerPhone}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="black">Delivery Address</Text>
                                            <Text fontWeight="medium" color="gray.800">{selectedOrder.deliveryAddress}</Text>
                                        </Box>
                                    </Grid>
                                </Box>

                                {/* Order Details */}
                                <Box>
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>Order Details</Text>
                                    <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                                        <Box>
                                            <Text fontSize="sm" color="black">Vehicle</Text>
                                            <Text fontWeight="medium" color="gray.800">{selectedOrder.vehicle}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="black">Total Price</Text>
                                            <Text fontWeight="medium" color="gray.800">CZK {selectedOrder.totalPrice.toLocaleString()}</Text>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="black">Services</Text>
                                            <HStack mt={1}>
                                                {selectedOrder.services.map((service, index) => (
                                                    <Badge key={index} colorScheme="red">
                                                        {service}
                                                    </Badge>
                                                ))}
                                            </HStack>
                                        </Box>
                                        <Box>
                                            <Text fontSize="sm" color="black">Payment Status</Text>
                                            <Badge
                                                colorScheme={selectedOrder.paymentStatus === 'Paid' ? 'green' : 'yellow'}
                                            >
                                                {selectedOrder.paymentStatus}
                                            </Badge>
                                        </Box>
                                    </Grid>
                                </Box>

                                {/* Order Timeline */}
                                <Box>
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>Order Timeline</Text>
                                    <VStack spacing={4} align="stretch">
                                        {selectedOrder.timeline.map((event, index) => (
                                            <Flex key={index} align="center" gap={3}>
                                                <Box p={2} bg="white" borderRadius="full">
                                                    <FiCalendar />
                                                </Box>
                                                <Box>
                                                    <Text fontSize="sm" fontWeight="medium" color="gray.800">{event.status}</Text>
                                                    <Text fontSize="xs" color="black">
                                                        {event.date} at {event.time}
                                                    </Text>
                                                </Box>
                                            </Flex>
                                        ))}
                                    </VStack>
                                </Box>

                                {/* Notes */}
                                <Box>
                                    <Text fontSize="lg" fontWeight="bold" mb={4}>Notes</Text>
                                    <Input
                                        placeholder="Add notes about this order..."
                                        value={selectedOrder.notes}
                                        onChange={(e) => {
                                            setOrders(prevOrders =>
                                                prevOrders.map(order =>
                                                    order.id === selectedOrder.id
                                                        ? { ...order, notes: e.target.value }
                                                        : order
                                                )
                                            );
                                        }}
                                    />
                                </Box>

                                {/* Action Buttons */}
                                <HStack justify="flex-end" spacing={3}>
                                    <Button
                                        colorScheme="blue"
                                        onClick={() => {
                                            handleUpdateOrderStatus(selectedOrder.id, 'Processing');
                                            onOrderDetailsClose();
                                        }}
                                    >
                                        Mark as Processing
                                    </Button>
                                    <Button
                                        colorScheme="green"
                                        onClick={() => {
                                            handleUpdateOrderStatus(selectedOrder.id, 'Completed');
                                            onOrderDetailsClose();
                                        }}
                                    >
                                        Mark as Completed
                                    </Button>
                                    <Button
                                        colorScheme="red"
                                        onClick={() => {
                                            handleCancelOrder(selectedOrder.id);
                                            onOrderDetailsClose();
                                        }}
                                    >
                                        Cancel Order
                                    </Button>
                                </HStack>
                            </VStack>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>

            <FinancingDetailsModal
                isOpen={isFinancingDetailsOpen}
                onClose={onFinancingDetailsClose}
                application={selectedFinancingApplication}
                onApprove={handleApproveFinancing}
                onReject={handleRejectFinancing}
            />
        </Box>
    );
};

interface AddVehicleModalProps {
    isOpen: boolean;
    onClose: () => void;
    setVehicles: React.Dispatch<React.SetStateAction<Vehicle[]>>;
}

const AddVehicleModal: React.FC<AddVehicleModalProps> = ({ isOpen, onClose, setVehicles }) => {
    const [images, setImages] = useState<File[]>([]);
    const [imagesPreviews, setImagesPreviews] = useState<string[]>([]);
    const [features, setFeatures] = useState<string[]>(['Digital cockpit', 'Keyless entry', 'Apple CarPlay', 'Navigation system']);
    const [newFeature, setNewFeature] = useState('');
    const [showFeatureInput, setShowFeatureInput] = useState(false);
    const [vehicleData, setVehicleData] = useState({
        name: '',
        power: '',
        basePrice: '',
        manufactureDate: '',
        transmission: 'automatic',
        fuelType: 'petrol',
        mileage: '',
    });

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setImages(prevImages => [...prevImages, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagesPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages(prevImages => prevImages.filter((_, i) => i !== index));
        setImagesPreviews(prevPreviews => {
            URL.revokeObjectURL(prevPreviews[index]);
            return prevPreviews.filter((_, i) => i !== index);
        });
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        const files = Array.from(e.dataTransfer.files);
        const imageFiles = files.filter(file => file.type.startsWith('image/'));

        if (imageFiles.length > 0) {
            setImages(prevImages => [...prevImages, ...imageFiles]);
            const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
            setImagesPreviews(prevPreviews => [...prevPreviews, ...newPreviews]);
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVehicleData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleRemoveFeature = (featureToRemove: string) => {
        setFeatures(features.filter(feature => feature !== featureToRemove));
    };

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFeatures([...features, newFeature.trim()]);
            setNewFeature('');
            setShowFeatureInput(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleAddFeature();
        }
    };

    const handleSubmit = () => {
        const newVehicle: Vehicle = {
            id: Date.now(), // temporary ID for demo
            name: vehicleData.name,
            power: vehicleData.power + ' kW',
            basePrice: parseFloat(vehicleData.basePrice),
            priceWithoutVAT: parseFloat(vehicleData.basePrice) / 1.21, // Assuming 21% VAT
            services: {
                carAudit: 1990,
                homeDelivery: 15005,
                importMOT: 4490,
                adminFee: 800,
                registration: 1990,
            },
            // features: features, // Add features to Vehicle type if needed
            // images: imagesPreviews, // Handle image upload to server in a real app
        };

        setVehicles(prev => [...prev, newVehicle]);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    <Flex align="center" gap={2}>
                        <Box />
                        Add New Vehicle
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={6} align="stretch">
                        {/* Image Upload Section */}
                        <Box
                            border="2px dashed"
                            borderColor="gray.300"
                            borderRadius="lg"
                            p={8}
                            textAlign="center"
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                        >
                            <VStack spacing={4}>
                                <Box as={FiImage} size="48px" color="gray.400" />
                                <Text color="gray.600">Drag and drop vehicle images here</Text>
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    display="none"
                                    id="image-upload-input"
                                />
                                <FormLabel htmlFor="image-upload-input" cursor="pointer">
                                    <Button as="span" colorScheme="red">
                                        Browse Files
                                    </Button>
                                </FormLabel>
                            </VStack>
                        </Box>

                        {/* Image Preview Section */}
                        {imagesPreviews.length > 0 && (
                            <HStack wrap="wrap" spacing={4} mt={4}>
                                {imagesPreviews.map((preview, index) => (
                                    <Box key={index} position="relative">
                                        <Image
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            boxSize="100px"
                                            objectFit="cover"
                                            borderRadius="lg"
                                        />
                                        <IconButton
                                            aria-label="Remove image"
                                            icon={<Box as={FiX} />}
                                            size="xs"
                                            colorScheme="red"
                                            borderRadius="full"
                                            position="absolute"
                                            top="-5px"
                                            right="-5px"
                                            onClick={() => removeImage(index)}
                                        />
                                    </Box>
                                ))}
                            </HStack>
                        )}

                        {/* Vehicle Details Form */}
                        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap={6}>
                            {/* Basic Information */}
                            <VStack spacing={4} align="stretch">
                                <FormControl isRequired>
                                    <FormLabel>Brand & Model</FormLabel>
                                    <Input
                                        name="name"
                                        value={vehicleData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g., BMW Cooper"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Manufacturing Date</FormLabel>
                                    <Input
                                        type="month"
                                        name="manufactureDate"
                                        value={vehicleData.manufactureDate}
                                        onChange={handleInputChange}
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Power (kW)</FormLabel>
                                    <Input
                                        type="number"
                                        name="power"
                                        value={vehicleData.power}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 100"
                                    />
                                </FormControl>

                                <FormControl isRequired>
                                    <FormLabel>Base Price (CZK)</FormLabel>
                                    <Input
                                        type="number"
                                        name="basePrice"
                                        value={vehicleData.basePrice}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 634490"
                                    />
                                </FormControl>
                            </VStack>

                            {/* Additional Details */}
                            <VStack spacing={4} align="stretch">
                                <FormControl>
                                    <FormLabel>Transmission</FormLabel>
                                    <Select
                                        name="transmission"
                                        value={vehicleData.transmission}
                                        onChange={handleInputChange}
                                    >
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Fuel Type</FormLabel>
                                    <Select
                                        name="fuelType"
                                        value={vehicleData.fuelType}
                                        onChange={handleInputChange}
                                    >
                                        <option value="petrol">Petrol</option>
                                        <option value="diesel">Diesel</option>
                                        <option value="electric">Electric</option>
                                        <option value="hybrid">Hybrid</option>
                                    </Select>
                                </FormControl>

                                <FormControl>
                                    <FormLabel>Mileage (km)</FormLabel>
                                    <Input
                                        type="number"
                                        name="mileage"
                                        value={vehicleData.mileage}
                                        onChange={handleInputChange}
                                        placeholder="e.g., 18496"
                                    />
                                </FormControl>
                            </VStack>
                        </Grid>

                        {/* Features Section */}
                        <Box>
                            <HStack mb={2} spacing={2} align="center">
                                <Text fontSize="lg" fontWeight="semibold">Features</Text>
                                {showFeatureInput ? (
                                    <HStack spacing={2}>
                                        <Input
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder="Enter feature name"
                                            size="sm"
                                            autoFocus
                                        />
                                        <IconButton
                                            aria-label="Add feature"
                                            icon={<Box as={FiPlus} />}
                                            size="sm"
                                            colorScheme="green"
                                            onClick={handleAddFeature}
                                        />
                                        <IconButton
                                            aria-label="Cancel add feature"
                                            icon={<Box as={FiX} />}
                                            size="sm"
                                            colorScheme="red"
                                            onClick={() => {
                                                setShowFeatureInput(false);
                                                setNewFeature('');
                                            }}
                                        />
                                    </HStack>
                                ) : (
                                    <Button
                                        size="sm"
                                        leftIcon={<Box as={FiPlus} />}
                                        colorScheme="red"
                                        variant="outline"
                                        onClick={() => setShowFeatureInput(true)}
                                    >
                                        Add Feature
                                    </Button>
                                )}
                            </HStack>
                            <HStack wrap="wrap" spacing={2}>
                                {features.map((feature) => (
                                    <Badge key={feature} colorScheme="gray" pr={1}>
                                        <HStack spacing={1} align="center">
                                            <Text>{feature}</Text>
                                            <IconButton
                                                aria-label="Remove feature"
                                                icon={<Box as={FiX} />}
                                                size="xs"
                                                variant="ghost"
                                                colorScheme="gray"
                                                onClick={() => handleRemoveFeature(feature)}
                                            />
                                        </HStack>
                                    </Badge>
                                ))}
                            </HStack>
                        </Box>

                        {/* Submit Button */}
                        <HStack justify="flex-end" pt={4}>
                            <Button variant="ghost" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={handleSubmit} leftIcon={<Box as={FiPlus} />}>
                                Add Vehicle
                            </Button>
                        </HStack>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AdminDashboard; 