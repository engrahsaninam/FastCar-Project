'use client';

import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import {
  Box,
  Text,
  Heading,
  Flex,
  Checkbox,
  Badge,
  Stack,
  FormControl,
  FormLabel,
  RadioGroup,
  SimpleGrid,
  Radio,
  Slider,
  SliderTrack,
  useBreakpointValue,
  Grid,
  GridItem,
  SliderFilledTrack,
  SliderThumb,
  Button,
  VStack,
  Divider,
  HStack,
  List,
  ListItem,
  ListIcon,
  useColorModeValue,
  useDisclosure,
  Container,
  Link,
  Input
} from '@chakra-ui/react';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  InfoIcon,
  TimeIcon,
  PhoneIcon,
  Icon,
  CheckIcon,
  CheckCircleIcon,
  CreditCardIcon,
  CarIcon,
  TruckIcon,
  WalletIcon
} from '@chakra-ui/icons';
import { Clock, ChevronDown, ChevronUp, FileText, Info, DollarSign, Calendar, Percent, CreditCard, Check, Circle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';

// Animation wrapper components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionText = motion(Text);
const MotionBadge = motion(Badge);

const steps = [
  {
    id: 1,
    step: 'STEP 1',
    title: 'Payment method',
    icon: CreditCardIcon,
    isLocked: false,
    items: [
      { id: 'financing', title: 'Financing or wire transfer?' }
    ]
  },
  {
    id: 2,
    step: 'STEP 2',
    title: 'Car condition check',
    icon: CarIcon,
    isLocked: true,
    items: [
      { id: 'inspection', title: 'CarAudit™ vehicle inspection' }
    ]
  },
  {
    id: 3,
    step: 'STEP 3',
    title: 'Delivery',
    icon: TruckIcon,
    isLocked: true,
    items: [
      { id: 'delivery', title: 'Delivery' },
      { id: 'additional', title: 'Additional Services' },
      { id: 'guard', title: 'FastCar Guard', badge: 'RECOMMENDED' }
    ]
  },
  {
    id: 4,
    step: 'STEP 4',
    title: 'Payment',
    icon: WalletIcon,
    isLocked: true,
    items: [
      { id: 'payment', title: 'Payment' }
    ]
  }
];

const StepHeader = ({ step, title, isLocked, isActive }) => (
  <MotionBox
    mb={6}
    initial={false}
    animate={{ opacity: isLocked ? 0.4 : 1 }}
  >
    <Text fontSize="xs" fontWeight="medium" mb={1} color="red.500">
      {step}
    </Text>
    <Heading as="h2" fontSize="xl" fontWeight="bold" color="gray.900">
      {title}
    </Heading>
  </MotionBox>
);

const StepItem = ({ title, badge, isLocked, isFirst, showChevron, isActive, onClick, isCompleted }) => {
  // Local state to track if this item is expanded
  const [isExpanded, setIsExpanded] = useState(isActive);

  const handleClick = () => {
    if (!isLocked && showChevron) {
      setIsExpanded(!isExpanded);
      // Call the parent onClick with the new state
      onClick?.(!isExpanded);
    }
  };

  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');
  const textColor = isLocked ? 'gray.400' : 'gray.800';

  return (
    <MotionFlex
      onClick={handleClick}
      align="center"
      justify="space-between"
      p={4}
      cursor={isLocked ? 'not-allowed' : 'pointer'}
      bg={bgColor}
      shadow={isFirst ? 'sm' : 'none'}
      borderBottomWidth={isFirst ? '1px' : '0'}
      pb={isFirst ? 5 : 4}
      opacity={isLocked ? 0.7 : 1}
      _hover={{
        bg: isLocked ? bgColor : hoverBgColor,
      }}
    >
      <Flex align="center" gap={3}>
        {isCompleted ? (
          <Flex
            w="24px"
            h="24px"
            borderRadius="full"
            bg="green.500"
            align="center"
            justify="center"
          >
            <CheckIcon w="16px" h="16px" color="white" />
          </Flex>
        ) : (
          <TimeIcon w="20px" h="20px" color={isLocked ? 'gray.400' : 'red.500'} />
        )}
        <Text fontSize="15px" fontWeight="semibold" color={textColor}>
          {title}
        </Text>
      </Flex>

      <Flex align="center" gap={2}>
        {badge && (
          <MotionBadge
            px={2}
            py={0.5}
            fontSize="11px"
            fontWeight="medium"
            bg="#ffeef6"
            color="#f88181"
            borderRadius="md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {badge}
          </MotionBadge>
        )}
        {showChevron && (
          <MotionBox
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDownIcon w="20px" h="20px" color="gray.400" />
          </MotionBox>
        )}
      </Flex>
    </MotionFlex>
  );
};

const StepContent = ({ children, isActive }) => (
  <AnimatePresence>
    {isActive && (
      <MotionBox
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        overflow="hidden"
      >
        {children}
      </MotionBox>
    )}
  </AnimatePresence>
);

const RadioOption = ({ id, label, isSelected, onChange, isDisabled = false, applicationSent = false }) => {
  // Special case for application sent
  if (id === 'financing' && applicationSent) {
    // Light red background with "Application sent" text
    return (
      <Box
        as="label"
        display="flex"
        alignItems="center"
        gap={3}
        px={4}
        py={3}
        borderRadius="md"
        borderWidth="1px"
        borderColor="transparent"
        bg="#CBD5E0"
        flex="1"
        cursor="not-allowed"
      >
        <Flex
          w="20px"
          h="20px"
          borderRadius="full"
          bg="white"
          alignItems="center"
          justifyContent="center"
        >
          <Circle size={12} />
        </Flex>
        <Text
          fontSize="sm"
          color="white"
          fontWeight="medium"
        >
          Application sent
        </Text>
        <Input
          type="radio"
          name="payment-method"
          value={id}
          checked={true}
          onChange={() => { }}
          display="none"
          disabled={true}
        />
      </Box>
    );
  }

  // Standard radio button styling
  const isActive = isSelected && !isDisabled;

  return (
    <Box
      as="label"
      display="flex"
      alignItems="center"
      gap={3}
      px={4}
      py={3}
      borderRadius="md"
      borderWidth="1px"
      cursor={isDisabled ? "not-allowed" : "pointer"}
      flex="1"
      transition="all 0.2s ease-in-out"
      bg={isActive ? "white" : "gray.50"}
      borderColor={isActive ? "red.500" : "gray.200"}
      opacity={isDisabled ? 0.8 : 1}
      _hover={{
        borderColor: !isDisabled && (isActive ? "red.500" : "gray.300"),
        bg: !isDisabled && (isActive ? "white" : "gray.100")
      }}
    >
      <Flex
        w="20px"
        h="20px"
        borderRadius="full"
        borderWidth={isActive ? "6px" : "1px"}
        borderColor={isActive ? "red.500" : "gray.300"}
        bg="white"
        alignItems="center"
        justifyContent="center"
        transition="all 0.2s"
      />
      <Text
        fontSize="sm"
        color="gray.700"
        fontWeight="medium"
      >
        {label}
      </Text>
      <Input
        type="radio"
        name="payment-method"
        value={id}
        checked={isSelected}
        onChange={() => !isDisabled && onChange(id)}
        display="none"
        disabled={isDisabled}
      />
    </Box>
  );
};

const PaymentMethodStep = ({ selected, onSelect, applicationSent = false }) => {
  const options = [
    {
      id: 'financing',
      label: "Yes, I'm interested"
    },
    {
      id: 'bank-transfer',
      label: "No, I want to pay by bank transfer"
    }
  ];

  return (
    <Box w="full">
      <Heading as="h3" fontSize="15px" fontWeight="semibold" color="gray.900" mb={4}>
        Are you interested in financing?
      </Heading>
      <Stack direction={{ base: 'column', sm: 'row' }} spacing={3}>
        {options.map((option) => (
          <RadioOption
            key={option.id}
            id={option.id}
            label={option.label}
            isSelected={selected === option.id}
            onChange={onSelect}
            isDisabled={applicationSent && option.id === 'financing'}
            applicationSent={applicationSent && option.id === 'financing'}
          />
        ))}
      </Stack>
    </Box>
  );
};



const FinancingOption = ({ option, selectedOption, onSelect }) => {
  const isSelected = option.id === selectedOption;

  return (
    <Box flex="1">
      <MotionBox
        whileHover={{ scale: isSelected ? 1.02 : 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        onClick={() => onSelect(option.id)}
        borderRadius="lg"
        py={{ base: 2, md: 4 }}
        px={{ base: 3, md: 6 }}
        mb={{ base: 2, md: 4 }}
        cursor="pointer"
        bg={isSelected ? 'red.500' : 'gray.200'}
        color={isSelected ? 'white' : 'gray.400'}
        _hover={{
          bg: isSelected ? 'red.500' : 'gray.300'
        }}
      >
        <Flex align="center" justify="space-between">
          <Text fontWeight="medium" fontSize={{ base: 'xs', md: 'md' }}>
            {option.title}
          </Text>
          {option.isNew && (
            <Badge
              px={{ base: 1, md: 1.5 }}
              py={0.5}
              fontSize={{ base: '9px', md: '11px' }}
              fontWeight="medium"
              bg="red.100"
              color="gray.800"
              borderRadius="md"
            >
              NEW
            </Badge>
          )}
        </Flex>
      </MotionBox>
      <MotionBox
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        textAlign="center"
        mt={4}
        color={isSelected ? 'gray.900' : 'gray.400'}
      >
        <Text
          fontSize={{ base: 'md', md: '2xl' }}
          fontWeight="bold"
          mb={{ base: 0.5, md: 1 }}
        >
          {option.percentage}
        </Text>
        <Text fontSize={{ base: 'xs', md: 'sm' }}>
          {option.description}
        </Text>
      </MotionBox>
    </Box>
  );
};

const PaybackPeriodSlider = ({ paybackPeriod, onPeriodChange, selectedOption }) => {
  // Define the periods based on the selected financing option
  const periods = selectedOption === 'low-installment'
    ? [24, 36, 48]
    : [12, 24, 36, 48, 60, 72, 84, 96];

  // Calculate the slider value as a percentage
  const minPeriod = periods[0];
  const maxPeriod = periods[periods.length - 1];
  const sliderValue = ((paybackPeriod - minPeriod) / (maxPeriod - minPeriod)) * 100;

  // Add direct click handler
  const handlePeriodClick = (period) => {
    onPeriodChange(period);
  };

  // Custom tick component
  const Tick = ({ value }) => (
    <Flex
      direction="column"
      alignItems="center"
      cursor="pointer"
      onClick={() => handlePeriodClick(value)}
    >
      <Text fontSize="xs" mt={1} color="gray.500">{value}</Text>
    </Flex>
  );

  return (
    <Box mt={8} px="20px">
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="medium" color="gray.900">
          Payback period
        </Text>
        <Text fontWeight="bold" color="gray.900">
          {paybackPeriod} months
        </Text>
      </Flex>
      <Box position="relative" w="full" h="8px" mb={10}>
        <Slider
          value={sliderValue}
          onChange={(val) => {
            // Convert percentage back to period value
            const calculatedPeriod = Math.round(
              minPeriod + (val / 100) * (maxPeriod - minPeriod)
            );

            // Find the closest valid period
            let closestPeriod = periods[0];
            let minDiff = Math.abs(calculatedPeriod - periods[0]);

            for (let i = 1; i < periods.length; i++) {
              const diff = Math.abs(calculatedPeriod - periods[i]);
              if (diff < minDiff) {
                minDiff = diff;
                closestPeriod = periods[i];
              }
            }

            onPeriodChange(closestPeriod);
          }}
        >
          <SliderTrack bg="gray.200" h="8px" borderRadius="full">
            <SliderFilledTrack bg="red.500" />
          </SliderTrack>
          <SliderThumb
            boxSize={5}
            bg="white"
            borderWidth="2px"
            borderColor="red.500"
            boxShadow="md"
          />
        </Slider>
        {/* Tick marks container */}
        <Flex
          position="absolute"
          w="full"
          justify="space-between"
          bottom="-32px"
        >
          {periods.map(period => (
            <Tick key={period} value={period} />
          ))}
        </Flex>
      </Box>
    </Box>
  );
};


const DownPaymentSlider = ({ downPayment, onDownPaymentChange, totalPrice = 27440, lastPaymentPercentage = 49, selectedOption }) => {
  // Define percentage range and steps based on selected option
  const minPercentage = selectedOption === 'low-installment' ? 10 : 20;
  const maxPercentage = 90;

  // Generate steps based on selectedOption
  const percentageSteps = selectedOption === 'low-installment'
    ? [10, 20, 30, 40, 50, 60, 70, 80, 90]
    : [20, 30, 40, 50, 60, 70, 80, 90];

  // Calculate the formatted amount
  const formattedAmount = `€${Math.round(totalPrice * downPayment / 100).toLocaleString('de-DE')}`;
  const lastPaymentAmount = `€${Math.round(totalPrice * lastPaymentPercentage / 100).toLocaleString('de-DE')}`;

  // Find which segment is active based on current value
  const getActiveSegment = (value) => {
    if (selectedOption === 'low-installment') {
      if (value < 15) return 10;
    }

    if (value < 25) return 20;
    if (value < 35) return 30;
    if (value < 45) return 40;
    if (value < 55) return 50;
    if (value < 65) return 60;
    if (value < 75) return 70;
    if (value < 85) return 80;
    return 90;
  };

  const activeSegment = getActiveSegment(downPayment);

  return (
    <Box width="100%" px="20px" py="20px">
      {/* Header with title and value */}
      <Flex justify="space-between" align="center" mb={3}>
        <Flex align="center">
          <Text fontWeight="medium" fontSize="sm" color="red.900">Down payment (%)</Text>
          <Box ml={1} cursor="help">
            <InfoIcon boxSize="14px" color="red.200" />
          </Box>
        </Flex>
        <Text fontWeight="bold" fontSize="sm">
          {downPayment}% = {formattedAmount}
        </Text>
      </Flex>

      {/* Background segments */}
      <Box position="relative" mb={6}>
        <Flex width="100%" height="24px" mb="16px">
          {percentageSteps.map((step, i) => {
            // Default background is very light gray
            let bgColor = "gray.100";

            // If this is the selected segment, make it darker green
            if (step === activeSegment) {
              bgColor = "green.200";
            } else {
              // All other segments are light green
              bgColor = "green.50";
            }

            return (
              <Box
                key={step}
                flex={1}
                bg={bgColor}
                borderLeftWidth={i === 0 ? 0 : "1px"}
                borderColor="white"
              />
            );
          })}
        </Flex>

        {/* The slider itself positioned on top of segments */}
        <Box
          position="absolute"
          top="10px"
          left="0"
          width="100%"
          zIndex="2"
        >
          <Slider
            min={minPercentage}
            max={maxPercentage}
            step={5}  // Changed to 5% steps
            value={downPayment}
            onChange={(val) => onDownPaymentChange(val)}
          >
            <SliderTrack bg="red.500" height="2px">
              <SliderFilledTrack bg="red.500" />
            </SliderTrack>
            <SliderThumb
              boxSize="24px"
              bg="red.500"
              borderWidth="3px"
              borderColor="white"
              boxShadow="0 1px 2px rgba(0,0,0,0.1)"
              _focus={{
                boxShadow: "0 0 0 3px rgba(229, 62, 62, 0.2)"
              }}
            />
          </Slider>
        </Box>

        {/* Percentage labels */}
        <Flex
          width="100%"
          justify="space-between"
          mt="8px"
        >
          {percentageSteps.map(step => (
            <Text
              key={step}
              fontSize="sm"
              fontWeight={activeSegment === step ? "medium" : "normal"}
              color={activeSegment === step ? "red.500" : "gray.500"}
              cursor="pointer"
              onClick={() => onDownPaymentChange(step)}
              textAlign="center"
              width="40px"
              ml={step === minPercentage ? "-15px" : 0}
              mr={step === maxPercentage ? "-15px" : 0}
            >
              {step}%
            </Text>
          ))}
        </Flex>
      </Box>

      {/* Last payment section */}
      <Flex justify="space-between" align="center" mt={2}>
        <Text fontWeight="medium" fontSize="sm" color="red.600">
          Last payment
        </Text>
        <Text fontWeight="bold" fontSize="sm">
          {lastPaymentPercentage}% = {lastPaymentAmount}
        </Text>
      </Flex>
    </Box>
  );
};

const FinancingParameters = ({
  downPayment,
  downPaymentAmount,
  installmentPeriod,
  interestRate,
  APR,
  monthlyPayment
}) => {
  // Use responsive layout based on screen size
  const layout = useBreakpointValue({
    base: "mobile", // Android/mobile style (stacked)
    md: "desktop"   // Desktop style (horizontal)
  });

  // Mobile/Android layout (stacked two-column grid)
  if (layout === "mobile") {
    return (
      <Box mt={8} width="100%">
        <Heading
          as="h3"
          fontSize={{ base: "18px", sm: "20px" }}
          fontWeight="bold"
          color="#0E2160"
          mb={4}
        >
          Parameters of your financing option.
        </Heading>

        <Box
          borderWidth="1px"
          borderRadius="lg"
          borderColor="gray.200"
          overflow="hidden"
          bg="white"
          p={4}
          width="100%"
        >
          <Grid
            templateColumns="1fr 1fr"
            templateRows="repeat(4, auto)"
            gap={3}
            width="100%"
          >
            {/* Left column - labels */}
            <GridItem>
              <Text fontSize="xs" fontWeight="medium" color="#4B4B4BFF" mb={3}>
                DOWNPAYMENT ({downPayment} %)
              </Text>
            </GridItem>

            {/* Right column - values */}
            <GridItem textAlign="right">
              <Text fontSize="md" fontWeight="semibold" color="#1F2937" mb={3}>
                €{downPaymentAmount?.toLocaleString()}
              </Text>
            </GridItem>

            <GridItem>
              <Text fontSize="xs" fontWeight="medium" color="#4B4B4BFF" mb={3}>
                INSTALLMENT
              </Text>
            </GridItem>

            <GridItem textAlign="right">
              <Text fontSize="md" fontWeight="semibold" color="#1F2937" mb={3}>
                {installmentPeriod}
              </Text>
            </GridItem>

            <GridItem>
              <Text fontSize="xs" fontWeight="medium" color="#4B4B4BFF" mb={3}>
                INTEREST RATE / APR
              </Text>
            </GridItem>

            <GridItem textAlign="right">
              <Text fontSize="md" fontWeight="semibold" color="#1F2937" mb={3}>
                {interestRate} % / {APR} %
              </Text>
            </GridItem>

            <GridItem>
              <Text fontSize="xs" fontWeight="medium" color="#E53E3E" mb={3}>
                MONTHLY
              </Text>
            </GridItem>

            <GridItem textAlign="right">
              <Text fontSize="md" fontWeight="semibold" color="#E53E3E" mb={3}>
                €{monthlyPayment}
              </Text>
            </GridItem>
          </Grid>
        </Box>

        <Box textAlign="center" mt={4}>
          <Link
            href="#"
            color="#E53E3E"
            fontWeight="medium"
            fontSize="14px"
            textDecoration="underline"
          >
            How does the Low Instalment Financing work?
          </Link>
        </Box>
      </Box>
    );
  }

  // Desktop layout (horizontal flex)
  return (
    <Box mt={8} px="15px">
      <Heading
        as="h3"
        fontSize={{ base: "20px", lg: "24px" }}
        fontWeight="bold"
        color="#0E2160"
        mb={4}
      >
        Parameters of your financing option.
      </Heading>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        borderColor="gray.200"
        overflow="hidden"
        bg="white"
      >
        <Flex
          justify="space-between"
          alignItems="center"
          py={5}
          px={6}
          flexWrap={{ base: "wrap", lg: "nowrap" }}
          gap={{ base: 4, lg: 2 }}
        >
          <Box flex="1" minW={{ base: "45%", lg: "auto" }}>
            <Text
              fontSize="xs"
              fontWeight="medium"
              color="#4B4B4BFF"
              textTransform="uppercase"
              mb={2}
            >
              DOWNPAYMENT ({downPayment} %)
            </Text>
            <Text
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="medium"
              color="#1F2937"
            >
              €{downPaymentAmount?.toLocaleString()}
            </Text>
          </Box>

          <Box flex="1" minW={{ base: "45%", lg: "auto" }}>
            <Text
              fontSize="xs"
              fontWeight="medium"
              color="#4B4B4BFF"
              textTransform="uppercase"
              mb={2}
            >
              INSTALLMENT
            </Text>
            <Text
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="medium"
              color="#1F2937"
            >
              {installmentPeriod}
            </Text>
          </Box>

          <Box flex="1" minW={{ base: "45%", lg: "auto" }}>
            <Text
              fontSize="xs"
              fontWeight="medium"
              color="#4B4B4BFF"
              textTransform="uppercase"
              mb={2}
            >
              INTEREST RATE / APR
            </Text>
            <Text
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="medium"
              color="#1F2937"
            >
              {interestRate} % / {APR} %
            </Text>
          </Box>

          <Box flex="1" minW={{ base: "45%", lg: "auto" }}>
            <Text
              fontSize="xs"
              fontWeight="medium"
              color="#E53E3E"
              textTransform="uppercase"
              mb={2}
            >
              MONTHLY
            </Text>
            <Text
              fontSize={{ base: "md", lg: "lg" }}
              fontWeight="medium"
              color="#E53E3E"
            >
              €{monthlyPayment}
            </Text>
          </Box>
        </Flex>
      </Box>

      <Flex justify="center" mt={4}>
        <Link
          href="#"
          color="#E53E3E"
          fontWeight="medium"
          fontSize="14px"
          textDecoration="underline"
        >
          How does the Low Instalment Financing work?
        </Link>
      </Flex>
    </Box>
  );
};

const FinancingInfoSection = () => {
  return (
    <Box
      bg="red.50"
      borderRadius="md"
      p={4}
      mt={8}
      width="100%"
    >
      <Flex alignItems="flex-start" gap={3}>
        <Icon as={InfoIcon} color="red.500" boxSize={5} mt={0.5} />
        <Box>
          <Text fontWeight="medium" color="red.900" mb={1}>
            The installment already includes the selected transport and other additional services.
          </Text>
          <Text fontSize="sm" color="black.600">
            When selecting other additional services, the advance payment and the installment are automatically recalculated.
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};



const FinancingSpecs = ({ onFinancingRequest, onFullPayment, onToggleSpecs }) => {
  // Local state for accordion
  const [isFinancingSpecsExpanded, setIsFinancingSpecsExpanded] = useState(true);

  // State for financing options
  const [selectedOption, setSelectedOption] = useState('low-installment');

  // State for payback period
  const [paybackPeriod, setPaybackPeriod] = useState(36);

  // Add down payment state - set default based on selected option
  const [downPayment, setDownPayment] = useState(40);

  // Example total price
  const totalPrice = 27440;

  const options = [
    {
      id: 'low-installment',
      title: 'Low Instalment',
      isNew: true,
      percentage: '91.4 %',
      description: 'choose low payments'
    },
    {
      id: 'regular-loan',
      title: 'Regular loan',
      percentage: '8.6 %',
      description: 'choose to avoid an increased final payment'
    }
  ];

  // Update payback period when option changes to ensure it's valid for the option
  useEffect(() => {
    if (selectedOption === 'low-installment') {
      // For low installment, ensure period is one of [24, 36, 48]
      if (![24, 36, 48].includes(paybackPeriod)) {
        setPaybackPeriod(36); // Default to 36 if current value is invalid
      }

      // Ensure down payment is at least 10% for low-installment
      if (downPayment < 10) {
        setDownPayment(10);
      }
    } else {
      // For regular loan, ensure period is within [12, 96]
      if (paybackPeriod < 12) {
        setPaybackPeriod(12);
      } else if (paybackPeriod > 96) {
        setPaybackPeriod(96);
      }
      // Round to nearest 12
      const remainder = paybackPeriod % 12;
      if (remainder !== 0) {
        setPaybackPeriod(paybackPeriod - remainder + (remainder > 6 ? 12 : 0));
      }

      // Ensure down payment is at least 20% for regular-loan
      if (downPayment < 20) {
        setDownPayment(20);
      }
    }
  }, [selectedOption, paybackPeriod, downPayment]);

  // Handler for toggle financing specs
  const handleFinancingSpecsToggle = (e) => {
    // Stop propagation to prevent parent handlers from being triggered
    e.stopPropagation();

    // Toggle the local state
    const newExpandedState = !isFinancingSpecsExpanded;
    setIsFinancingSpecsExpanded(newExpandedState);

    // Notify parent component about the toggle
    if (onToggleSpecs) {
      onToggleSpecs(newExpandedState);
    }
  };

  // Handler for selecting an option
  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId);
  };

  // Handler for changing payback period
  const handlePeriodChange = (period) => {
    setPaybackPeriod(period);
  };

  // Handler for changing down payment
  const handleDownPaymentChange = (percentage) => {
    setDownPayment(percentage);
  };

  // Calculate down payment amount
  const downPaymentAmount = (downPayment / 100) * totalPrice;

  // Calculate monthly payment (simplified example)
  const calculateMonthlyPayment = () => {
    const loanAmount = totalPrice - downPaymentAmount;
    const interestRate = selectedOption === 'low-installment' ? 9.5 : 8.5;
    const monthlyRate = interestRate / 100 / 12;

    // For low-installment, we need to account for the balloon payment
    if (selectedOption === 'low-installment') {
      const balloonAmount = loanAmount * 0.28; // 28% balloon payment
      const amountToFinance = loanAmount - balloonAmount;
      const payment = (amountToFinance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -paybackPeriod));
      return Math.round(payment);
    } else {
      // Standard loan formula
      const payment = (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -paybackPeriod));
      return Math.round(payment);
    }
  };

  const monthlyPayment = calculateMonthlyPayment();

  return (
    <Box
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      p={5}
      bg="white"
      mt={6}
      borderWidth="1px"
      borderRadius="lg"
      as={motion.div}
    >
      <Flex
        align="center"
        justify="space-between"
        borderBottomWidth={isFinancingSpecsExpanded ? "1px" : "0"}
        pb={isFinancingSpecsExpanded ? 5 : 0}
        mb={isFinancingSpecsExpanded ? 6 : 0}
      >
        <Flex align="center" gap={2}>
          <TimeIcon w="20px" h="20px" color="red.500" />
          <Heading as="h4" fontSize="15px" fontWeight="semibold" color="gray.900">
            Financing specifications
          </Heading>
        </Flex>
        <Button
          onClick={handleFinancingSpecsToggle}
          p={1}
          _hover={{ bg: 'gray.100' }}
          borderRadius="full"
          variant="ghost"
        >
          {isFinancingSpecsExpanded ? (
            <ChevronUpIcon w="20px" h="20px" color="gray.500" />
          ) : (
            <ChevronDownIcon w="20px" h="20px" color="gray.500" />
          )}
        </Button>
      </Flex>

      {isFinancingSpecsExpanded && (
        <>
          <Flex w="full" gap={{ base: 1, sm: 4 }}>
            {options.map((option) => (
              <FinancingOption
                key={option.id}
                option={option}
                selectedOption={selectedOption}
                onSelect={handleOptionSelect}
              />
            ))}
          </Flex>

          <PaybackPeriodSlider
            paybackPeriod={paybackPeriod}
            onPeriodChange={handlePeriodChange}
            selectedOption={selectedOption}
          />

          {/* Down Payment Slider - now passing selectedOption */}
          <DownPaymentSlider
            downPayment={downPayment}
            onDownPaymentChange={handleDownPaymentChange}
            totalPrice={totalPrice}
            selectedOption={selectedOption}
          />

          <FinancingParameters
            downPayment={downPayment}
            downPaymentAmount={downPaymentAmount}
            installmentPeriod={paybackPeriod}
            interestRate={selectedOption === 'low-installment' ? '9.50' : '8.50'}
            APR={selectedOption === 'low-installment' ? '11.55' : '10.25'}
            monthlyPayment={monthlyPayment}
          />

          <FinancingInfoSection />

          {/* Add FinancingCTASection with proper props passing */}
          <FinancingCTASection
            onPrimaryClick={onFinancingRequest}
            onSecondaryClick={onFullPayment}
          />
        </>
      )}
    </Box>
  );
};


// No changes needed here - it's already set up to receive callbacks
const FinancingCTASection = ({
  heading = "Are you interested in this financing offer?",
  subText = "You can verify financing options without obligation. You will receive the results within 240 minutes.",
  primaryButtonText = "I want financing",
  secondaryButtonText = "I will pay in full",
  helpText = "Need some advice?",
  phoneHours = "Mo-Su 8 am-8 pm",
  phoneNumber = "+39 02 8736 1995",
  onPrimaryClick,
  onSecondaryClick
}) => {
  return (
    <Box mt={10}>
      {/* Heading and description */}
      <Text
        fontSize="20px"
        fontWeight="bold"
        color="#0E2160"
        mb="8px"
        lineHeight="1.2"
      >
        {heading}
      </Text>
      <Text
        fontSize="16px"
        color="#4A5568"
        mb="24px"
        lineHeight="1.5"
      >
        {subText}
      </Text>

      {/* CTA Buttons */}
      <Flex
        direction={{ base: "column", sm: "row" }}
        gap="16px"
        width="100%"
        mb="32px"
      >
        <Button
          bg="#E53E3E"
          color="white"
          height="48px"
          fontSize="16px"
          fontWeight="semibold"
          borderRadius="4px"
          width={{ base: "100%", sm: "50%" }}
          _hover={{ bg: "#C53030" }}
          onClick={onPrimaryClick}
        >
          {primaryButtonText}
        </Button>
        <Button
          variant="outline"
          borderColor="#E53E3E"
          color="#1A202C"
          height="48px"
          fontSize="16px"
          fontWeight="semibold"
          borderRadius="4px"
          width={{ base: "100%", sm: "50%" }}
          _hover={{ bg: "gray.50" }}
          onClick={onSecondaryClick}
        >
          {secondaryButtonText}
        </Button>
      </Flex>

      {/* Gray Background Advice Section - extends to bottom edge */}
      <Box
        bg="#F7FAFC"
        border="#E53E3E"
        py={4}
        mx={-5}
        mt={8}
        position="relative"
        left={0}
        right={0}
        width="calc(100% + 40px)"
        borderBottomLeftRadius="lg"
        borderBottomRightRadius="lg"
        marginBottom={-5}
      >
        <Flex
          justifyContent="space-between"
          alignItems="center"
          flexDirection={{ base: "column", sm: "row" }}
          gap={{ base: "16px", sm: 0 }}
          px={5}
        >
          <Text
            color="#4A5568"
            fontWeight="medium"
            fontSize="16px"
          >
            {helpText}
          </Text>
          <HStack
            spacing="12px"
            bg="white"
            py="8px"
            px="16px"
            borderRadius="full"
          >
            <Icon as={PhoneIcon} color="#E53E3E" boxSize="18px" />
            <Box>
              <Text fontSize="12px" color="#718096" lineHeight="1.2">
                {phoneHours}
              </Text>
              <Text fontWeight="bold" color="#1A202C" fontSize="16px">
                {phoneNumber}
              </Text>
            </Box>
          </HStack>
        </Flex>
      </Box>
    </Box>
  );
};


const ConnectedFinancingUI = ({ onDecline, onApplicationSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    telephone: '',
    email: ''
  });

  // Consent state
  const [consentChecked, setConsentChecked] = useState(false);

  // Track if application has been sent
  const [applicationSent, setApplicationSent] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    name: '',
    surname: '',
    telephone: '',
    email: ''
  });

  // Track if fields have been visited
  const [touched, setTouched] = useState({
    name: false,
    surname: false,
    telephone: false,
    email: false
  });

  // Define validation schema using Zod
  const formSchema = z.object({
    name: z.string().min(2, { message: "Name required" }),
    surname: z.string().min(2, { message: "Surname required" }),
    telephone: z.string().min(2, { message: "You must enter at least 2 characters" }),
    email: z.string().email({ message: "E-mail address is required" })
  });

  const validateField = (field, value) => {
    try {
      formSchema.shape[field].parse(value);
      return '';
    } catch (error) {
      return error.errors[0].message;
    }
  };

  const handleConsentChange = (e) => {
    setConsentChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the form is valid
    const formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        formErrors[field] = error;
        isValid = false;
      }
    });

    if (!isValid) {
      setErrors(formErrors);

      // Mark all fields as touched to show errors
      const touchedFields = {};
      Object.keys(formData).forEach(field => {
        touchedFields[field] = true;
      });
      setTouched(touchedFields);

      return;
    }

    // If form is valid and consent is checked, mark application as sent
    if (consentChecked) {
      setApplicationSent(true);

      // Notify the parent component
      if (onApplicationSubmit) {
        onApplicationSubmit();
      }
    }
  };

  // Handle the decline button click
  const handleDecline = () => {
    if (onDecline) {
      onDecline();
    }
  };

  // UI data
  const data = {
    header: { title: "Information about financing" },
    content: { description: "We need a few more details from you to establish the exact instalment amount and to check whether the provider will approve your application. It will only take you a few minutes to complete the form." },
    notice: {
      title: "You should know...",
      description: "Before you fill in your details, please read the information below carefully. Before you enter into a financing agreement, the correctness of the data will need to be verified. Usually, the following must be submitted with an application:",
      footer: "Additional documents or certificates may be required in rare cases. We will inform you about the specific terms before you place an order for a car."
    },
    thanks: {
      title: "Thank you for completing the form",
      description: "Do not forget to give us your consent before submitting it, so that we can pass your data onto the provider."
    },
    info: {
      title: "On business days (9 a.m. – 6 p.m.), we are usually able to obtain approval within 30 minutes.",
      description: "It is entirely up to you to decide whether you will take advantage of the financing; you can decide after receiving information about approval."
    },
    consent: {
      text: "I agree with the processing of the personal data for the purpose of arranging financing at licensed finance provider."
    },
    buttons: {
      check: "Check the financing options (non-binding)",
      decline: "Thank you, I'm not interested anymore",
      sent: "Application sent"
    },
    requirements: {
      primary: [
        "an identification document",
        "a health insurance card",
        "if you are an employee - your latest wage payment slip",
        "if you are a pensioner - \"certificazione UNICA 2021 od ultimo cedolino pensione od estratto conto con ultimo accredito o modello Unico con INVIO telematico o Modello 730\"",
        "if you are a sole proprietor - \"modello UNICO 2021 con ricevuta di presentazione di invio telematico\" and driver's licence"
      ],
    },
    colors: {
      connectionLine: "#FFA9A9",
      cardBackground: "white",
      headerTextColor: "#2E3A59",
      noticeBackground: "#FCF8F8FF",
      borderColor: "#EDF2F7",
      textColor: "#4A5568",
      infoIconColor: "#CE3131FF",
      iconBackground: "#FBE6E6FF",
      footerTextColor: "#718096",
      checkIconColor: "#CE3131FF",
      errorColor: "#E53E3E",
      validColor: "#38A169",
      successBackground: "#F0FFF4",
      infoBackground: "#FFEBEBFF",
      primaryButtonBg: "#DD4C4CFF",
      primaryButtonHoverBg: "#B93A3AFF",
      sentButtonBg: "#CBD5E0"
    }
  };

  // Modify the handleChange function to provide immediate validation feedback
  const handleChange = (field) => (e) => {
    const value = e.target.value;

    // Update form data
    setFormData({
      ...formData,
      [field]: value
    });

    // Always mark field as touched when typing begins
    if (!touched[field]) {
      setTouched({
        ...touched,
        [field]: true
      });
    }

    // Perform immediate validation on each keystroke
    const validationError = validateField(field, value);
    setErrors({
      ...errors,
      [field]: validationError
    });
  };

  // Simplify handleBlur - it just ensures a field is marked as touched
  const handleBlur = (field) => () => {
    if (!touched[field]) {
      setTouched({
        ...touched,
        [field]: true
      });

      // Validate if not already validated
      const validationError = validateField(field, formData[field]);
      setErrors({
        ...errors,
        [field]: validationError
      });
    }
  };

  // Modify the field status icon function to show feedback immediately
  const getFieldStatusIcon = (field) => {
    // Only show icon if field has been interacted with (has value or has been touched)
    if (!touched[field] && !formData[field]) return null;

    if (errors[field]) {
      // Show error icon
      return (
        <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
          <Box bg={data.colors.errorColor} borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
            <Text color="white" fontSize="xs" fontWeight="bold">!</Text>
          </Box>
        </Box>
      );
    } else if (formData[field]) {
      // Show success icon
      return (
        <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
          <Box bg={data.colors.validColor} borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
            <Check size={12} color="white" />
          </Box>
        </Box>
      );
    }

    return null;
  };
  const renderIcon = (color) => (
    <Box mr={2} mt="2px" bg={data.colors.iconBackground} borderRadius="full" p="2px">
      <Check size={16} color={color} />
    </Box>
  );

  return (
    <Box position="relative" ml={{ base: 10, md: 14 }} mt={4}>
      {/* SVG Connection line */}
      <Box position="absolute" top="-36px" left="-40px">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <path d="M20,20 L20,80 C20,86.6 25.4,92 32,92 L40,92" stroke={data.colors.connectionLine} strokeWidth="2" fill="none" />
        </svg>
      </Box>

      {/* Main container */}
      <Box bg={data.colors.cardBackground} borderRadius="md" boxShadow="sm" overflow="hidden" width="full" maxWidth="100%" borderWidth="1px" borderColor={data.colors.borderColor}>
        {/* Header section */}
        <Box py={4} px={6} borderBottomWidth="1px" borderColor={data.colors.borderColor} bg={data.colors.cardBackground}>
          <Text fontSize="md" fontWeight="600" color={data.colors.headerTextColor}>{data.header.title}</Text>
        </Box>

        {/* Content section */}
        <Box py={5} px={6} bg={data.colors.cardBackground}>
          <Text fontSize="sm" color={data.colors.textColor} lineHeight="1.6" mb={4}>{data.content.description}</Text>

          {/* Information notice - moved ABOVE form */}
          <Box bg={data.colors.noticeBackground} p={4} borderRadius="md" mb={6}>
            <Flex alignItems="center" mb={2}>
              <Box mr={2} mt="2px" bg={data.colors.iconBackground} borderRadius="full" p="2px">
                <Info size={16} color={data.colors.infoIconColor} />
              </Box>
              <Text fontWeight="600" color={data.colors.headerTextColor}>{data.notice.title}</Text>
            </Flex>

            <Text fontSize="sm" color={data.colors.textColor} mb={4}>{data.notice.description}</Text>

            {/* Document requirements */}
            <Box as="ul" listStyleType="none" pl={0} mb={4}>
              {data.requirements.primary.map((item, index) => (
                <Box key={`req-${index}`} as="li" display="flex" alignItems="flex-start" mb={3}>
                  {renderIcon(data.colors.checkIconColor)}
                  <Text fontSize="sm" color={data.colors.textColor}>{item}</Text>
                </Box>
              ))}
            </Box>

            <Text fontSize="xs" color={data.colors.footerTextColor} mt={2}>{data.notice.footer}</Text>
          </Box>

          {/* Form section - moved BELOW notice */}
          <form onSubmit={handleSubmit}>
            <Flex flexWrap="wrap" gap={4} mb={6}>
              {/* Name field */}
              <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                <FormLabel color={data.colors.headerTextColor} fontWeight="500" fontSize="sm">NAME</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.name}
                    onChange={handleChange('name')}
                    onBlur={handleBlur('name')}
                    placeholder="Name"
                    borderColor={errors.name && touched.name ? data.colors.errorColor : formData.name && !errors.name ? data.colors.validColor : data.colors.borderColor}
                    borderWidth="1px"
                    height="40px"
                    _focus={{
                      borderColor: errors.name ? data.colors.errorColor : data.colors.validColor,
                      boxShadow: "none"
                    }}
                    isDisabled={applicationSent}
                  />
                  {getFieldStatusIcon('name')}
                </Box>
                {errors.name && touched.name && (
                  <Text color={data.colors.errorColor} fontSize="xs" mt={1}>{errors.name}</Text>
                )}
              </FormControl>

              {/* Surname field */}
              <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                <FormLabel color={data.colors.headerTextColor} fontWeight="500" fontSize="sm">SURNAME</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.surname}
                    onChange={handleChange('surname')}
                    onBlur={handleBlur('surname')}
                    placeholder="Surname"
                    borderColor={errors.surname && touched.surname ? data.colors.errorColor : formData.surname && !errors.surname ? data.colors.validColor : data.colors.borderColor}
                    borderWidth="1px"
                    height="40px"
                    _focus={{
                      borderColor: errors.surname ? data.colors.errorColor : data.colors.validColor,
                      boxShadow: "none"
                    }}
                    isDisabled={applicationSent}
                  />
                  {getFieldStatusIcon('surname')}
                </Box>
                {errors.surname && touched.surname && (
                  <Text color={data.colors.errorColor} fontSize="xs" mt={1}>{errors.surname}</Text>
                )}
              </FormControl>

              {/* Telephone field */}
              <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                <FormLabel color={data.colors.headerTextColor} fontWeight="500" fontSize="sm">TELEPHONE NUMBER</FormLabel>
                <Flex>
                  <Box width="70px" mr={2} borderWidth="1px" borderColor={data.colors.borderColor} borderRadius="md" display="flex" alignItems="center" justifyContent="center" height="40px">
                    <Box as="span" width="24px" height="16px" borderRadius="sm" bg="red" mr={1}></Box>
                    <Text fontSize="sm">+43</Text>
                  </Box>
                  <Box position="relative" flex="1">
                    <Input
                      value={formData.telephone}
                      onChange={handleChange('telephone')}
                      onBlur={handleBlur('telephone')}
                      placeholder="Telephone number"
                      borderColor={errors.telephone && touched.telephone ? data.colors.errorColor : formData.telephone && !errors.telephone ? data.colors.validColor : data.colors.borderColor}
                      borderWidth="1px"
                      height="40px"
                      _focus={{
                        borderColor: errors.telephone ? data.colors.errorColor : data.colors.validColor,
                        boxShadow: "none"
                      }}
                      isDisabled={applicationSent}
                    />
                    {getFieldStatusIcon('telephone')}
                  </Box>
                </Flex>
                {errors.telephone && touched.telephone && (
                  <Text color={data.colors.errorColor} fontSize="xs" mt={1}>{errors.telephone}</Text>
                )}
              </FormControl>

              {/* Email field */}
              <FormControl width={{ base: "100%", md: "48%" }} isDisabled={applicationSent}>
                <FormLabel color={data.colors.headerTextColor} fontWeight="500" fontSize="sm">EMAIL</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.email}
                    onChange={handleChange('email')}
                    onBlur={handleBlur('email')}
                    placeholder="Email"
                    borderColor={errors.email && touched.email ? data.colors.errorColor : formData.email && !errors.email ? data.colors.validColor : data.colors.borderColor}
                    borderWidth="1px"
                    height="40px"
                    _focus={{
                      borderColor: errors.email ? data.colors.errorColor : data.colors.validColor,
                      boxShadow: "none"
                    }}
                    isDisabled={applicationSent}
                  />
                  {getFieldStatusIcon('email')}
                </Box>
                {errors.email && touched.email && (
                  <Text color={data.colors.errorColor} fontSize="xs" mt={1}>{errors.email}</Text>
                )}
              </FormControl>
            </Flex>

            {/* Success notification */}
            <Box bg={data.colors.successBackground} p={4} borderRadius="md" mb={4}>
              <Flex alignItems="flex-start">
                <Box mr={2} mt="2px">
                  <Box bg={data.colors.validColor} borderRadius="full" p="2px">
                    <Check size={16} color="white" />
                  </Box>
                </Box>
                <Box>
                  <Text fontWeight="600" color={data.colors.headerTextColor} mb={1}>{data.thanks.title}</Text>
                  <Text fontSize="sm" color={data.colors.textColor}>{data.thanks.description}</Text>
                </Box>
              </Flex>
            </Box>

            {/* Info notification */}
            <Box bg={data.colors.infoBackground} p={4} borderRadius="md" mb={6}>
              <Flex alignItems="flex-start">
                <Box mr={2} mt="2px">
                  <Box bg="#CE3131FF" borderRadius="full" p="2px">
                    <Info size={16} color="white" />
                  </Box>
                </Box>
                <Box>
                  <Text fontSize="sm" color={data.colors.textColor}>{data.info.title}</Text>
                  <Text fontSize="sm" color={data.colors.textColor}>{data.info.description}</Text>
                </Box>
              </Flex>
            </Box>

            {/* Consent checkbox */}
            <Box mb={6}>
              <Checkbox
                isChecked={consentChecked}
                onChange={handleConsentChange}
                colorScheme="red"
                size="md"
                isDisabled={applicationSent}
              >
                <Text fontSize="sm" color={data.colors.textColor}>{data.consent.text}</Text>
              </Checkbox>
            </Box>

            {/* Action buttons */}
            <Flex direction="column" gap={3} align="center" width="100%">
              {applicationSent ? (
                <Button
                  type="button"
                  bg={data.colors.sentButtonBg}
                  color="white"
                  width="100%"
                  maxWidth="400px"
                  height={{ base: "auto", sm: "48px" }}
                  minHeight="48px"
                  py={2}
                  px={4}
                  isDisabled={true}
                  borderRadius="md"
                  fontWeight="500"
                  whiteSpace="normal"
                  textAlign="center"
                  leftIcon={<Check size={18} />}
                >
                  {data.buttons.sent}
                </Button>
              ) : (
                <Button
                  type="submit"
                  bg="#E53E3E"
                  color="white"
                  _hover={{ bg: "#C53030" }}
                  width="100%"
                  maxWidth="400px"
                  height={{ base: "auto", sm: "48px" }}
                  minHeight="48px"
                  py={2}
                  px={4}
                  isDisabled={!consentChecked}
                  borderRadius="md"
                  fontWeight="500"
                  whiteSpace="normal"
                  textAlign="center"
                >
                  {data.buttons.check}
                </Button>
              )}

              {!applicationSent && (
                <Button
                  variant="link"
                  color="#E53E3E"
                  fontSize="sm"
                  _hover={{ textDecoration: "underline" }}
                  fontWeight="normal"
                  height="auto"
                  paddingBottom="20px"
                  whiteSpace="normal"
                  textAlign="center"
                  onClick={handleDecline}
                >
                  {data.buttons.decline}
                </Button>
              )}
            </Flex>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

const CarInspectionContent = ({ isFinancingSelected = false, isFinancingApproved = false, onContinue = () => { } }) => {
  // Data for inspection steps
  const steps = [
    {
      number: 1,
      title: "We get the car VIN from the dealer",
      description: "and we check the legal status in European countries to see whether the car has been stolen or crashed and we also check the mileage."
    },
    {
      number: 2,
      title: "We arrange a visit by a mechanic",
      description: "who checks the actual technical condition of the car."
    },
    {
      number: 3,
      title: "In the case of a tax-deductible car, we check,",
      description: "to see whether the car really is tax-deductible."
    },
    {
      number: 4,
      title: "You receive an inspection report",
      description: "including evaluation of the condition of the car. We assume a guarantee for this being the actual condition of the car and are liable to you for this if you subsequently decide to buy the car."
    }
  ];

  return (
    <Box>
      {/* Main content */}
      <Box>
        <Text mb={4}>
          We want you to buy a car in the best possible condition and this is why we have to first of all
          thoroughly inspect the chosen car. You receive a details inspection report on the technical condition
          of the car, photo documentation and our recommendation.
        </Text>

        {/* What happens section */}
        <Box bg="gray.50" p={6} borderRadius="lg">
          <Heading as="h3" size="md" mb={8} textAlign="center">
            What happens after ordering the inspection
          </Heading>

          <Flex direction={{ base: "column", md: "row" }} mb={6}>
            {/* Left side with numbered steps */}
            <Box flex="1" pr={{ md: 6 }}>
              <VStack spacing={6} align="stretch">
                {steps.map((step) => (
                  <HStack key={step.number} align="flex-start" spacing={4}>
                    <Flex
                      justifyContent="center"
                      alignItems="center"
                      minWidth="32px"
                      height="32px"
                      bg="red.100"
                      color="red.600"
                      fontSize="md"
                      fontWeight="bold"
                      borderRadius="full"
                    >
                      {step.number}
                    </Flex>
                    <Box>
                      <Text fontWeight="bold">{step.title}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {step.description}
                      </Text>
                    </Box>
                  </HStack>
                ))}
              </VStack>
            </Box>

            {/* Right side with pricing */}
            <Box width={{ base: "100%", md: "300px" }} mt={{ base: 6, md: 0 }}>
              <Box
                bg="red.500"
                color="white"
                py={3}
                textAlign="center"
                borderTopRadius="md"
                fontWeight="bold"
              >
                SALE PRICE
              </Box>
              <Box
                border="1px"
                borderColor="gray.200"
                p={4}
                pb={6}
                textAlign="center"
                borderTopWidth="0"
                borderBottomRadius="md"
                bg="white"
              >
                <Text fontSize="md" textDecoration="line-through" color="gray.500" mb={1}>€199</Text>
                <Text fontSize="3xl" fontWeight="bold" color="gray.900" mb={5}>€119</Text>

                <Box
                  bg="green.50"
                  py={3}
                  px={4}
                  borderRadius="md"
                  display="flex"
                  alignItems="flex-start"
                  gap={3}
                >
                  <Box color="green.500" mt="1">
                    <CheckIcon boxSize={4} />
                  </Box>
                  <Box textAlign="left">
                    <Text fontWeight="medium" color="green.700">Money-back guarantee</Text>
                    <Text fontSize="sm" color="gray.700">if the car fails the inspection.</Text>
                  </Box>
                </Box>
              </Box>
              {/* Text below the price box */}
              <Box fontSize="sm" color="gray.600" mt={6}>
                <Text>
                  We try to reserve each car with the dealer before the inspection. However, we cannot guarantee this
                  reservation. It all depends on the specific dealer. If the car is sold in the meanwhile, we will
                  provide you a full refund of the price of the inspection.
                </Text>
              </Box>
            </Box>
          </Flex>

          {/* Only show financing notification if using financing */}
          {isFinancingSelected && (
            <Box
              bg="red.50"
              p={4}
              borderRadius="md"
              mt={6}
            >
              <Flex gap={3} align="flex-start">
                <Box color="red.500" mt={1} flexShrink={0}>
                  <AlertCircle size={20} />
                </Box>
                <Text color="red.800" fontWeight="medium">
                  When buying with financing, it is necessary to wait for the pre-approval of the loan to order.
                </Text>
              </Flex>
            </Box>
          )}

          {/* Continue button - always visible but disabled when financing is selected and not approved */}
          <Box textAlign="center" mt={6}>
            <Button
              colorScheme="red"
              size="lg"
              px={10}
              onClick={onContinue}
              bg="red.500"
              _hover={{ bg: "red.600" }}
              color="white"
              isDisabled={isFinancingSelected && !isFinancingApproved}
            >
              Continue
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};


const ConnectedCarInspectionContent = ({ onComplete }) => {
  // States
  const [accountType, setAccountType] = useState('consumer');
  const [isVatPayer, setIsVatPayer] = useState(false);
  const [formData, setFormData] = useState({
    // Company info
    companyId: '',
    companyName: '',
    // Personal info
    name: '',
    surname: '',
    telephone: '',
    birthDate: '',
    // Address info
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    country: 'Italy'
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [sameContactAddress, setSameContactAddress] = useState(true);

  // Ref for debouncing
  const debounceTimers = useRef({});

  // Form validation schema - different for company and consumer
  const getFormSchema = () => {
    const baseSchema = {
      name: z.string().min(2, { message: "Name required" }),
      surname: z.string().min(2, { message: "Surname required" }),
      telephone: z.string().min(2, { message: "You must enter at least 2 characters" }),
      birthDate: z.string().regex(/^\d{2}\.\d{2}\.\d{4}$/, {
        message: "Enter the date in the format dd.mm.yyyy (day.month.year) and don't forget the dots between the numbers :)"
      }),
      street: z.string().min(2, { message: "This field is required" }),
      houseNumber: z.string().min(1, { message: "This field is required" }),
      postalCode: z.string().min(5, { message: "Enter valid ZIP code" }),
      city: z.string().min(2, { message: "This field is required" }),
      country: z.string().min(1, { message: "Country is required" })
    };

    // Add company fields if company is selected
    if (accountType === 'company') {
      return {
        ...baseSchema,
        companyId: z.string().min(2, { message: "Company ID required" }),
        companyName: z.string().min(2, { message: "Company name required" })
      };
    }

    return baseSchema;
  };

  // Debounced validation
  const validateWithDebounce = (field, value) => {
    if (debounceTimers.current[field]) {
      clearTimeout(debounceTimers.current[field]);
    }

    debounceTimers.current[field] = setTimeout(() => {
      try {
        const schema = getFormSchema();
        if (schema[field]) {
          z.object({ [field]: schema[field] }).parse({ [field]: value });
          setErrors(prev => ({ ...prev, [field]: '' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, [field]: error.errors[0].message }));
      }
      debounceTimers.current[field] = null;
    }, 300);
  };

  // Handlers
  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData({ ...formData, [field]: value });
    setTouched({ ...touched, [field]: true });
    validateWithDebounce(field, value);
  };

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
    // Clear any company-related errors when switching to consumer
    if (type === 'consumer') {
      setErrors(prev => ({
        ...prev,
        companyId: '',
        companyName: ''
      }));
    }
  };

  // Field status icon component
  const FieldIcon = ({ field }) => {
    if (!touched[field]) return null;

    return errors[field] ? (
      <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
        <Box bg="red.500" borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
          <Text color="white" fontSize="xs" fontWeight="bold">!</Text>
        </Box>
      </Box>
    ) : formData[field] ? (
      <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
        <Box bg="green.500" borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
          <CheckIcon boxSize={3} color="white" />
        </Box>
      </Box>
    ) : null;
  };

  return (
    <Box position="relative" ml={{ base: 10, md: 14 }} mt={4}>
      {/* Connection line */}
      <Box position="absolute" top="-36px" left="-40px">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
          <path d="M20,20 L20,80 C20,86.6 25.4,92 32,92 L40,92" stroke="#FFA9A9" strokeWidth="2" fill="none" />
        </svg>
      </Box>

      {/* Main container */}
      <Box bg="white" borderRadius="md" overflow="hidden" borderWidth="1px" borderColor="gray.200" boxShadow="sm">
        {/* Header */}
        <Box py={4} px={6} borderBottomWidth="1px" borderColor="gray.200">
          <Text fontSize="lg" fontWeight="bold" color="gray.700">Billing address</Text>
        </Box>

        {/* Account type toggle */}
        <Flex borderRadius="md" overflow="hidden" mx={4} mt={4}>
          <Box
            flex={1} py={3}
            bg={accountType === 'consumer' ? "red.500" : "gray.100"}
            color={accountType === 'consumer' ? "white" : "gray.700"}
            textAlign="center" fontWeight={accountType === 'consumer' ? "bold" : "normal"}
            cursor="pointer" onClick={() => handleAccountTypeChange('consumer')}
            borderLeftRadius="md"
          >
            Consumer
          </Box>
          <Box
            flex={1} py={3}
            bg={accountType === 'company' ? "red.500" : "gray.100"}
            color={accountType === 'company' ? "white" : "gray.700"}
            textAlign="center" fontWeight={accountType === 'company' ? "bold" : "normal"}
            cursor="pointer" onClick={() => handleAccountTypeChange('company')}
            borderRightRadius="md"
          >
            Company
          </Box>
        </Flex>

        {/* Form content */}
        <Box p={6}>
          {/* VAT Payer Checkbox */}
          {accountType === 'company' && (
            <Box mb={6}>
              <Checkbox
                isChecked={isVatPayer}
                onChange={(e) => setIsVatPayer(e.target.checked)}
                colorScheme="red"
                size="md"
              >
                <Text ml={2} fontSize="md" color="gray.700">
                  I'm a VAT payer
                </Text>
              </Checkbox>
            </Box>
          )}

          {/* Company fields - only shown for company account type */}
          {accountType === 'company' && (
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">COMPANY ID</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.companyId}
                    onChange={handleChange('companyId')}
                    placeholder="Company ID"
                    borderColor={touched.companyId && errors.companyId ? "red.500" : "gray.200"}
                    borderRadius="md" height="40px"
                  />
                  <FieldIcon field="companyId" />
                </Box>
                {touched.companyId && errors.companyId && (
                  <Text color="red.500" fontSize="xs" mt={1}>{errors.companyId}</Text>
                )}
              </FormControl>

              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">COMPANY NAME</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.companyName}
                    onChange={handleChange('companyName')}
                    placeholder="Company name (full name if you are self-employed)"
                    borderColor={touched.companyName && errors.companyName ? "red.500" : "gray.200"}
                    borderRadius="md" height="40px"
                  />
                  <FieldIcon field="companyName" />
                </Box>
                {touched.companyName && errors.companyName && (
                  <Text color="red.500" fontSize="xs" mt={1}>{errors.companyName}</Text>
                )}
              </FormControl>
            </SimpleGrid>
          )}

          {/* Personal Information Fields */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {/* Name field */}
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">NAME</FormLabel>
              <Box position="relative">
                <Input
                  value={formData.name}
                  onChange={handleChange('name')}
                  placeholder="Name"
                  borderColor={touched.name && errors.name ? "red.500" : "gray.200"}
                  borderRadius="md" height="40px"
                />
                <FieldIcon field="name" />
              </Box>
              {touched.name && errors.name && (
                <Text color="red.500" fontSize="xs" mt={1}>{errors.name}</Text>
              )}
            </FormControl>

            {/* Surname field */}
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">SURNAME</FormLabel>
              <Box position="relative">
                <Input
                  value={formData.surname}
                  onChange={handleChange('surname')}
                  placeholder="Surname"
                  borderColor={touched.surname && errors.surname ? "red.500" : "gray.200"}
                  borderRadius="md" height="40px"
                />
                <FieldIcon field="surname" />
              </Box>
              {touched.surname && errors.surname && (
                <Text color="red.500" fontSize="xs" mt={1}>{errors.surname}</Text>
              )}
            </FormControl>

            {/* Telephone field */}
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">TELEPHONE NUMBER</FormLabel>
              <Flex>
                <Box width="90px" mr={2}>
                  <Flex
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md" alignItems="center" height="40px" px={2}
                    justifyContent="space-between"
                  >
                    <Flex alignItems="center">
                      <Box as="span" width="24px" height="16px" bg="red" mr={1.5} borderRadius="sm" position="relative" overflow="hidden">
                        <Box position="absolute" top="0" left="0" width="full" height="33%" bg="yellow" />
                      </Box>
                      <Text fontSize="sm">+34</Text>
                    </Flex>
                    <ChevronDownIcon />
                  </Flex>
                </Box>
                <Box position="relative" flex="1">
                  <Input
                    value={formData.telephone}
                    onChange={handleChange('telephone')}
                    placeholder="Telephone number"
                    borderColor={touched.telephone && errors.telephone ? "red.500" : "gray.200"}
                    borderRadius="md" height="40px"
                  />
                  <FieldIcon field="telephone" />
                </Box>
              </Flex>
              {touched.telephone && errors.telephone && (
                <Text color="red.500" fontSize="xs" mt={1}>{errors.telephone}</Text>
              )}
            </FormControl>

            {/* Birth Date field */}
            <FormControl>
              <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">BIRTH DATE</FormLabel>
              <Box position="relative">
                <Input
                  value={formData.birthDate}
                  onChange={handleChange('birthDate')}
                  placeholder="dd.mm.yyyy"
                  borderColor={touched.birthDate && errors.birthDate ? "red.500" : "gray.200"}
                  borderRadius="md" height="40px"
                />
                <FieldIcon field="birthDate" />
              </Box>
              {touched.birthDate && errors.birthDate && (
                <Text color="red.500" fontSize="xs" mt={1}>{errors.birthDate}</Text>
              )}
            </FormControl>
          </SimpleGrid>

          {/* Billing Address Divider */}
          <Box py={4} my={4} position="relative" display="flex" alignItems="center" width="100%">
            <Box flex="1">
              <Divider borderColor="red.600" />
            </Box>
            <Text fontSize="md" fontWeight="600" color="red.600" mx={4}>
              Billing address
            </Text>
            <Box flex="1">
              <Divider borderColor="red.600" />
            </Box>
          </Box>

          {/* Address Form - Grid Layout (3-row) */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={6}>
            {/* Street field */}
            <GridItem colSpan={{ md: 1 }}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">STREET</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.street}
                    onChange={handleChange('street')}
                    placeholder="Street"
                    borderColor={touched.street && errors.street ? "red.500" : "gray.200"}
                    borderRadius="md" height="40px"
                  />
                  <FieldIcon field="street" />
                </Box>
                {touched.street && errors.street && (
                  <Text color="red.500" fontSize="xs" mt={1}>{errors.street}</Text>
                )}
              </FormControl>
            </GridItem>

            {/* House Number field */}
            <GridItem colSpan={{ md: 1 }}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">HOUSE NUMBER</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.houseNumber}
                    onChange={handleChange('houseNumber')}
                    placeholder="House number"
                    borderColor={touched.houseNumber && errors.houseNumber ? "red.500" : "gray.200"}
                    borderRadius="md" height="40px"
                  />
                  <FieldIcon field="houseNumber" />
                </Box>
                {touched.houseNumber && errors.houseNumber && (
                  <Text color="red.500" fontSize="xs" mt={1}>{errors.houseNumber}</Text>
                )}
              </FormControl>
            </GridItem>

            {/* Postal Code field */}
            <GridItem colSpan={{ md: 1 }}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">POSTAL CODE</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.postalCode}
                    onChange={handleChange('postalCode')}
                    placeholder="Postal code"
                    borderColor={touched.postalCode && errors.postalCode ? "red.500" : "gray.200"}
                    borderRadius="md" height="40px"
                  />
                  <FieldIcon field="postalCode" />
                </Box>
                {touched.postalCode && errors.postalCode && (
                  <Text color="red.500" fontSize="xs" mt={1}>{errors.postalCode}</Text>
                )}
              </FormControl>
            </GridItem>
          </SimpleGrid>

          {/* City and Country fields */}
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={6}>
            {/* City field */}
            <GridItem colSpan={{ md: 1 }}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">CITY</FormLabel>
                <Box position="relative">
                  <Input
                    value={formData.city}
                    onChange={handleChange('city')}
                    placeholder="City"
                    borderColor={touched.city && errors.city ? "red.500" : "gray.200"}
                    borderRadius="md" height="40px"
                  />
                  <FieldIcon field="city" />
                </Box>
                {touched.city && errors.city && (
                  <Text color="red.500" fontSize="xs" mt={1}>{errors.city}</Text>
                )}
              </FormControl>
            </GridItem>

            {/* Country field */}
            <GridItem colSpan={{ md: 1 }}>
              <FormControl>
                <FormLabel fontSize="xs" fontWeight="bold" color="gray.700">COUNTRY</FormLabel>
                <Box position="relative">
                  <Box
                    borderWidth="1px"
                    borderColor="gray.200"
                    borderRadius="md"
                    height="40px"
                    display="flex"
                    alignItems="center"
                    px={3}
                    justifyContent="space-between"
                    cursor="not-allowed"
                    bg="white"
                  >
                    <Flex alignItems="center">
                      <Box
                        as="span"
                        width="24px"
                        height="16px"
                        mr={2}
                        borderRadius="sm"
                        position="relative"
                        overflow="hidden"
                        display="flex"
                      >
                        <Box as="span" width="33%" height="full" bg="green" />
                        <Box as="span" width="34%" height="full" bg="white" />
                        <Box as="span" width="33%" height="full" bg="red" />
                      </Box>
                      <Text>Italy</Text>
                    </Flex>
                    <ChevronDownIcon />
                  </Box>
                  <Box position="absolute" right="10px" top="50%" transform="translateY(-50%)" zIndex="1">
                    <Box bg="green.500" borderRadius="full" w="20px" h="20px" display="flex" alignItems="center" justifyContent="center">
                      <CheckIcon boxSize={3} color="white" />
                    </Box>
                  </Box>
                </Box>
              </FormControl>
            </GridItem>
          </SimpleGrid>

          {/* Info box about country */}
          <Box bg="red.50" p={4} borderRadius="md" mb={4}>
            <Flex>
              <Box mr={3} mt="2px">
                <Box bg="red.400" borderRadius="full" w="24px" h="24px" display="flex" alignItems="center" justifyContent="center">
                  <Text color="white" fontSize="sm" fontWeight="bold">i</Text>
                </Box>
              </Box>
              <Text fontSize="sm" color="red.800">
                You cannot change the country any longer. If you need to make a change, please get in touch with our support.
              </Text>
            </Flex>
          </Box>

          {/* Contact Address Section */}
          <Box mt={6} mb={4}>
            <Text fontSize="md" fontWeight="bold" color="gray.700">CONTACT ADDRESS</Text>
            <Flex mt={2} alignItems="center">
              <Checkbox
                isChecked={sameContactAddress}
                onChange={(e) => setSameContactAddress(e.target.checked)}
                colorScheme="red"
                size="md"
                iconColor="white"
              >
                <Text ml={2} fontSize="md" color="red.600" fontWeight="medium">
                  Same as billing address
                </Text>
              </Checkbox>
            </Flex>
          </Box>

          {/* Confirm Button */}
          <Box display="flex" justifyContent="center" mt={6} mb={4}>
            <Button
              bg="red.600"
              color="white"
              size="lg"
              fontWeight="medium"
              px={8}
              py={6}
              _hover={{ bg: "red.700" }}
              boxShadow="md"
              onClick={onComplete}
            >
              Confirm the data
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};


const FinancingUI = ({
  financingData = {
    downpayment: 9322,
    downpaymentPercentage: 30,
    installment: 48,
    interestRate: 9.5,
    apr: 10.72,
    monthlyPayment: 369,
    carPrice: 31076,
    loanAmount: 21754,
    totalAmountPaid: 30848,
    lastPayment: 11027,
    reservationFee: 0,
    checkFee: 119,
    borrowedAmount: 21753,
    partner: "Agos Ducato S.p.A."
  }
}) => {
  // Making the financing section open by default
  const { isOpen: isSectionOpen, onToggle: toggleSection } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isDetailsOpen, onToggle: toggleDetails } = useDisclosure();

  // Format currency
  const formatCurrency = (amount) => {
    return `€${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  // Calculate percentages for progress bar
  const downpaymentPercentage = Math.round((financingData.downpayment / (financingData.downpayment + financingData.borrowedAmount)) * 100);
  const financingPercentage = 100 - downpaymentPercentage;

  return (
    <Box maxW="container.lg" mx="auto" mt={7} px={{ base: 3, md: 4 }}>
      {/* Financing Header */}
      <Box
        bg="white"
        p={{ base: 4, md: 5 }}
        borderTopRadius="lg"
        borderBottomWidth="1px"
        borderColor="gray.100"
        onClick={toggleSection}
        cursor="pointer"
      >
        <Flex justifyContent="space-between" alignItems="center" flexDirection={{ base: "row", sm: "row" }} gap={{ base: 2, sm: 0 }}>
          <Flex alignItems="center" gap={3}>
            <Box color="red.600">
              <Clock size={24} strokeWidth={2} />
            </Box>
            <Text fontWeight="bold" fontSize="xl" color="gray.800">Financing</Text>
          </Flex>
          <Flex alignItems="center">
            <Text fontWeight="medium" px={6} color="red.600" className="hidden sm:block">Application sent</Text>
            {isSectionOpen ? (
              <ChevronUp size={24} color="var(--chakra-colors-red-600)" />
            ) : (
              <ChevronDown size={24} color="var(--chakra-colors-red-600)" />
            )}
          </Flex>
        </Flex>
      </Box>

      {isSectionOpen && (
        <>
          {/* Processing notification */}
          <Box
            bg="green.50"
            p={{ base: 4, md: 5 }}
          >
            <Flex alignItems={{ base: "flex-start", sm: "center" }} gap={4} flexDirection={{ base: "column", sm: "row" }}>
              <Box color="green.600" mt={{ base: 0, sm: 1 }}>
                <FileText size={24} strokeWidth={2} />
              </Box>
              <Box>
                <Text fontWeight="bold" color="gray.700" fontSize={{ base: "md", md: "lg" }}>
                  Your request for financing is being processed
                </Text>
                <Text color="gray.700" mt={1} fontSize={{ base: "sm", md: "md" }}>
                  All you have to do now is wait, usually a request takes us 24 hours to process
                </Text>
              </Box>
            </Flex>
          </Box>

          {/* Financing Parameters */}
          <Box bg="white" p={{ base: 0, md: 6 }}>
            <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }} color="gray.800" mb={6} px={{ base: 4, md: 0 }}>
              Parameters of your financing option.
            </Text>

            {/* Main financing parameters - grid for all screen sizes, matching Image 1 */}
            <Box
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius={isDetailsOpen ? { base: "lg lg 0 0", md: "lg lg 0 0" } : "lg"}
              overflow="hidden"
              mx={{ base: 4, md: 0 }}
            >
              <Grid
                templateColumns={{ sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
                p={4}
                gap={{ base: 3, md: 4 }}
              >
                <GridItem colSpan={{ base: 1, md: 1 }}>
                  <Text fontSize="xs" color="red.600" fontWeight="medium" mb={2}>
                    DOWNPAYMENT ({financingData.downpaymentPercentage} %)
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    {formatCurrency(financingData.downpayment)}
                  </Text>
                </GridItem>

                <GridItem colSpan={{ base: 1, md: 1 }}>
                  <Text fontSize="xs" color="red.600" fontWeight="medium" mb={2}>
                    INSTALLMENT
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="gray.800">
                    {financingData.installment}
                  </Text>
                </GridItem>

                <GridItem colSpan={{ base: 1, md: 1 }}>
                  <Text fontSize="xs" color="red.600" fontWeight="medium" mb={2}>
                    INTEREST RATE / APR
                  </Text>
                  <Flex alignItems="center">
                    <Text fontSize="md" fontWeight="bold" color="gray.800">
                      {financingData.interestRate.toFixed(2)} %
                    </Text>
                    <Text fontSize="md" color="gray.500" ml={2}>
                      / {financingData.apr.toFixed(2)} %
                    </Text>
                  </Flex>
                </GridItem>

                <GridItem colSpan={{ base: 1, md: 1 }}>
                  <Text fontSize="xs" color="red.600" fontWeight="medium" mb={2}>
                    MONTHLY
                  </Text>
                  <Text fontSize="lg" fontWeight="bold" color="red.600">
                    {formatCurrency(financingData.monthlyPayment)}
                  </Text>
                </GridItem>
              </Grid>
            </Box>

            {!isDetailsOpen ? (
              // Show financing details button - only visible when details are collapsed
              <Box
                bg="red.50"
                p={4}
                cursor="pointer"
                mx={{ base: 4, md: 0 }}
                onClick={toggleDetails}
                mb={4}
                borderWidth="1px"
                borderColor="gray.200"
                borderTopWidth="0"
                borderBottomRadius="lg"
                mt="-1px"
              >
                <Flex justifyContent="center" alignItems="center" gap={2}>
                  <Text color="red.600" fontWeight="medium" fontSize="sm">
                    Show financing details
                  </Text>
                  <ChevronDown size={16} color="var(--chakra-colors-red-600)" />
                  <Box color="gray.400">
                    <Info size={16} />
                  </Box>
                </Flex>
              </Box>
            ) : (
              // Financing details section - visible when expanded
              <Box
                borderWidth="1px"
                borderColor="gray.200"
                borderTopWidth="0"
                borderBottomRadius="lg"
                overflow="hidden"
                mx={{ base: 4, md: 0 }}
                mb={{ base: 4, md: 6 }}
                bg="red.50"
                mt="-1px"
              >
                <Box p={4}>
                  <Flex justify="space-between" alignItems="center" mb={4}>
                    <Text color="red.700" fontWeight="semibold" fontSize="sm">Selected product</Text>
                    <Text color="red.700" fontWeight="semibold" fontSize="sm">Regular loan</Text>
                  </Flex>

                  <Flex direction="column" gap={3}>
                    <Flex justify="space-between" alignItems="center">
                      <Text color="red.700" fontSize="sm">Monthly payment</Text>
                      <Text fontWeight="medium" fontSize="sm">{formatCurrency(financingData.monthlyPayment)}</Text>
                    </Flex>
                    <Flex justify="space-between" alignItems="center">
                      <Text color="red.700" fontSize="sm">Price of the car incl. services</Text>
                      <Text fontWeight="medium" fontSize="sm">{formatCurrency(financingData.carPrice)}</Text>
                    </Flex>
                    <Flex justify="space-between" alignItems="center">
                      <Text color="red.700" fontSize="sm">Loan Amount</Text>
                      <Text fontWeight="medium" fontSize="sm">{formatCurrency(financingData.loanAmount)}</Text>
                    </Flex>
                    <Flex justify="space-between" alignItems="center">
                      <Text color="red.700" fontSize="sm">Total amount paid</Text>
                      <Text fontWeight="medium" fontSize="sm">{formatCurrency(financingData.totalAmountPaid)}</Text>
                    </Flex>
                    <Flex justify="space-between" alignItems="center">
                      <Text color="red.700" fontSize="sm">Interest rate / APR</Text>
                      <Text fontWeight="medium" fontSize="sm">{financingData.interestRate.toFixed(2)} % / {financingData.apr.toFixed(2)} %</Text>
                    </Flex>
                    <Flex justify="space-between" alignItems="center">
                      <Text color="red.700" fontSize="sm">Last payment</Text>
                      <Text fontWeight="medium" fontSize="sm">{formatCurrency(financingData.lastPayment)}</Text>
                    </Flex>
                  </Flex>

                  <Box mt={4}>
                    <Flex gap={3} flexDirection={{ base: "column", sm: "row" }}>
                      <Box>
                        <Text color="red.700" fontSize="xs">* Our financial partner is {financingData.partner}.</Text>
                      </Box>
                      <Box>
                        <Text color="red.700" fontSize="xs">** ATTENTION: the simulated data is purely indicative. Duration of 72 months is currently unavailable. To receive a personalized pre-contractual information, fill out the form, express your interest in the loan and we will contact you.</Text>
                      </Box>
                    </Flex>
                  </Box>
                </Box>

                <Box
                  bg="red.50"
                  p={4}
                  cursor="pointer"
                  borderTopWidth="1px"
                  borderColor="gray.200"
                  onClick={toggleDetails}
                >
                  <Flex justifyContent="center" alignItems="center" gap={2}>
                    <Text color="red.600" fontWeight="medium" fontSize="sm">
                      Hide financing details
                    </Text>
                    <ChevronUp size={16} color="var(--chakra-colors-red-600)" />
                    <Box color="gray.400">
                      <Info size={16} />
                    </Box>
                  </Flex>
                </Box>
              </Box>
            )}
          </Box>

          {/* How the car is paid for in financing */}
          <Box bg="white" px={{ base: 4, md: 6 }} pb={{ base: 4, md: 6 }}>
            <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl" }} color="gray.800" mb={6}>
              How the car is paid for in financing
            </Text>

            <Box
              borderWidth="1px"
              borderColor="gray.200"
              borderRadius="lg"
              overflow="hidden"
              p={{ base: 4, md: 6 }}
            >
              <Flex direction="column" gap={6}>
                {/* Step 1 */}
                <Flex gap={4} alignItems="flex-start">
                  <Flex alignItems="center" justifyContent="center" bg="red.100" borderRadius="full" width="36px" height="36px" flexShrink={0}>
                    <Text fontWeight="medium" color="red.700">1</Text>
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="md" color="blue.900" mb={1}>
                      Now you only pay for reservation {formatCurrency(financingData.reservationFee)} and the check {formatCurrency(financingData.checkFee)}
                    </Text>
                    <Text color="gray.700" fontSize="sm">
                      If you decide not to buy the car after checking the car, the reservation will be refunded in full.
                    </Text>
                  </Box>
                </Flex>

                {/* Step 2 */}
                <Flex gap={4} alignItems="flex-start">
                  <Flex alignItems="center" justifyContent="center" bg="red.100" borderRadius="full" width="36px" height="36px" flexShrink={0}>
                    <Text fontWeight="medium" color="red.700">2</Text>
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="md" color="blue.900">
                      When you decide to buy the car after checking the car, you will pay {formatCurrency(financingData.downpayment)}
                    </Text>
                  </Box>
                </Flex>

                {/* Step 3 */}
                <Flex gap={4} alignItems="flex-start">
                  <Flex alignItems="center" justifyContent="center" bg="red.100" borderRadius="full" width="36px" height="36px" flexShrink={0}>
                    <Text fontWeight="medium" color="red.700">3</Text>
                  </Flex>
                  <Box>
                    <Text fontWeight="bold" fontSize="md" color="blue.900" mb={1}>
                      After the delivery of the car, the bank will repay the borrowed amount {formatCurrency(financingData.borrowedAmount)}
                    </Text>
                    <Text color="gray.700" fontSize="sm">
                      This amount is paid by the bank directly to us, you no longer have to worry about anything.
                    </Text>
                  </Box>
                </Flex>

                {/* Progress bar */}
                <Box mt={4}>
                  <Flex justify="space-between" mb={2}>
                    <Text fontWeight="medium" fontSize="sm">Downpayment</Text>
                    <Text fontWeight="medium" fontSize="sm">Financing</Text>
                  </Flex>
                  <Flex>
                    <Box width={`${downpaymentPercentage}%`} bg="red.500" height="8px" borderLeftRadius="md" />
                    <Box width={`${financingPercentage}%`} bg="green.400" height="8px" borderRightRadius="md" />
                  </Flex>
                  <Flex justify="space-between" mt={2}>
                    <Flex alignItems="center">
                      <Text fontWeight="bold" color="red.600" fontSize="md">{formatCurrency(financingData.downpayment)}</Text>
                      <Text color="gray.600" fontSize="sm" ml={1}>you pay</Text>
                    </Flex>
                    <Flex alignItems="center">
                      <Text fontWeight="bold" color="green.600" fontSize="md">{formatCurrency(financingData.borrowedAmount)}</Text>
                      <Text color="gray.600" fontSize="sm" ml={1}>the bank pays</Text>
                    </Flex>
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </Box>

        </>
      )}
    </Box>
  );
};


const StepOneContent = ({ onSelect = () => { } }) => {
  const [selected, setSelected] = useState(null);
  const [completedItems, setCompletedItems] = useState(new Set());
  const [expandedItems, setExpandedItems] = useState(new Set(['1-0']));
  const [activeStep, setActiveStep] = useState(1);

  // State for showing financing specs
  const [showFinancingSpecs, setShowFinancingSpecs] = useState(false);

  // Track if financing is specifically selected and the UI should be shown
  const [showFinancingUI, setShowFinancingUI] = useState(false);

  // Track if financing specs is expanded or collapsed
  const [isFinancingSpecsExpanded, setIsFinancingSpecsExpanded] = useState(true);

  // Track if billing address should be shown
  const [showBillingAddress, setShowBillingAddress] = useState(false);

  // Track if financing application has been sent
  const [applicationSent, setApplicationSent] = useState(false);

  // Track if financing has been approved
  const [isFinancingApproved, setIsFinancingApproved] = useState(false);

  // Reference to step 1 for scrolling
  const step1Ref = useRef(null);

  // Handler for the financing CTA primary button (I want financing)
  const handleFinancingRequest = () => {
    // This will be called when the "I want financing" button is clicked
    setShowFinancingUI(true);
  };

  // Add this useEffect to the component
  useEffect(() => {
    if (applicationSent && !isFinancingApproved) {
      console.log("Application sent detected, setting approval timer");
      const timer = setTimeout(() => {
        console.log("Setting financing approved to true");
        setIsFinancingApproved(true);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [applicationSent, isFinancingApproved]);

  // Then simplify the handleApplicationSubmit function
  const handleApplicationSubmit = () => {
    setApplicationSent(true);

    // Mark Step 1 as completed
    setCompletedItems(prev => {
      const next = new Set(prev);
      next.add('1-0');
      return next;
    });

    // Immediately open Step 2
    setActiveStep(2);
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.add('1-0');  // Keep Step 1 expanded
      next.add('2-0');  // Also expand Step 2
      return next;
    });

    // Approval will be handled by the useEffect hook

    // Scroll to step 1 to show the updated UI
    scrollToStep1();
  };


  // Handler for the financing CTA secondary button (I will pay in full)
  const handleFullPayment = () => {
    // This will be called when the "I will pay in full" button is clicked

    // 1. Close the financing UI
    setShowFinancingUI(false);

    // 2. Close financing specs and change selected payment method to bank-transfer
    setShowFinancingSpecs(false);
    setSelected('bank-transfer');
    onSelect('bank-transfer');

    // 3. Show the billing address form for bank transfer
    setShowBillingAddress(true);

    // 4. Mark Step 1 as completed
    setCompletedItems(prev => {
      const next = new Set(prev);
      next.add('1-0');
      return next;
    });

    // 5. Set active step to Step 2 and expand it
    setActiveStep(2);
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.add('2-0');
      return next;
    });

    // 6. Scroll back to Step 1
    scrollToStep1();
  };

  // Handler for when the financing specs accordion is toggled
  const handleFinancingSpecsToggle = (isExpanded) => {
    setIsFinancingSpecsExpanded(isExpanded);
  };

  // Handler for when "I'm not interested anymore" is clicked
  const handleFinancingDecline = () => {
    // Similar behavior to handleFullPayment

    // 1. Close the financing UI and specs
    setShowFinancingUI(false);
    setShowFinancingSpecs(false);

    // 2. Change selected payment method to bank-transfer
    setSelected('bank-transfer');
    onSelect('bank-transfer');

    // 3. Show the billing address form for bank transfer
    setShowBillingAddress(true);

    // 4. Mark Step 1 as completed
    setCompletedItems(prev => {
      const next = new Set(prev);
      next.add('1-0');
      return next;
    });

    // 5. Set active step to Step 2 and expand it
    setActiveStep(2);
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.add('2-0');
      return next;
    });

    // 6. Scroll back to Step 1
    scrollToStep1();
  };

  // Function to handle continue from car inspection
  const handleContinueFromInspection = () => {
    // Mark step as completed and move to next step
    setCompletedItems(prev => {
      const next = new Set(prev);
      next.add('2-0');
      return next;
    });

    // Move to step 3
    setActiveStep(3);
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.add('3-0');
      return next;
    });
  };

  // Function to scroll back to Step 1
  const scrollToStep1 = () => {
    // Use setTimeout to ensure the UI updates before scrolling
    setTimeout(() => {
      if (step1Ref.current) {
        step1Ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        // Fallback if ref is not available
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const handleSelect = (value) => {
    // If application has been sent, don't allow changing from financing
    if (applicationSent && selected === 'financing') {
      return;
    }

    setSelected(value);
    onSelect(value);

    // Only show financing specs if financing is selected
    if (value === 'financing') {
      // Show financing specs but not the UI yet
      setShowFinancingSpecs(true);
      setShowFinancingUI(false); // Reset this flag, will be set to true when CTA button is clicked
      setShowBillingAddress(false);
      setIsFinancingSpecsExpanded(true); // Default to expanded

      setCompletedItems(prev => {
        const next = new Set(prev);
        next.add('1-0');
        return next;
      });

      // When switching to financing, lock Step 2 again
      setActiveStep(1);

      // Remove Step 2 from expanded items
      setExpandedItems(prev => {
        const next = new Set(prev);
        next.add('1-0');
        next.delete('2-0');
        return next;
      });
    } else if (value === 'bank-transfer') {
      // For bank transfer, show the billing address form
      setShowFinancingSpecs(false);
      setShowFinancingUI(false);
      setShowBillingAddress(true);

      // Mark Step 1 as completed
      setCompletedItems(prev => {
        const next = new Set(prev);
        next.add('1-0');
        return next;
      });

      // Go to Step 2
      setActiveStep(2);
      setExpandedItems(prev => {
        const next = new Set(prev);
        next.add('2-0');
        return next;
      });
    } else {
      // For any other payment method
      setShowFinancingSpecs(false);
      setShowFinancingUI(false);
      setShowBillingAddress(false);

      // Mark Step 1 as completed
      setCompletedItems(prev => {
        const next = new Set(prev);
        next.add('1-0');
        return next;
      });

      // Expand Step 2
      setExpandedItems(prev => {
        const next = new Set(prev);
        next.add('1-0');
        next.add('2-0');
        return next;
      });

      // Unlock Step 2
      setActiveStep(2);
    }
  };

  const handleBillingComplete = () => {
    // Continue to next step
    setCompletedItems(prev => {
      const next = new Set(prev);
      next.add('2-0');
      return next;
    });
    setActiveStep(3);
    setExpandedItems(prev => {
      const next = new Set(prev);
      next.add('3-0');
      return next;
    });
  };

  const handleItemClick = (stepId, index, isExpanded) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      const key = `${stepId}-${index}`;
      if (isExpanded) {
        next.add(key);
      } else {
        next.delete(key);
      }
      return next;
    });
  };

  return (
    <Container maxW="4xl" py={6}>
      <MotionBox
        spacing={10}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        ref={step1Ref}
      >
        <VStack spacing={10} align="stretch">
          {steps.map((step) => {
            const isStepLocked = step.id > activeStep;

            return (
              <Box key={`step-${step.id}`}>
                <StepHeader
                  step={step.step}
                  title={step.title}
                  isLocked={isStepLocked}
                  isActive={!isStepLocked}
                />
                <VStack spacing={0} align="stretch">
                  {step.items.map((item, index) => {
                    const isItemExpanded = expandedItems.has(`${step.id}-${index}`);
                    const isItemCompleted = completedItems.has(`${step.id}-${index}`);

                    return (
                      <Box key={`item-${step.id}-${index}`} className='pb-4'>
                        <StepItem
                          title={item.title}
                          badge={item.badge}
                          isLocked={isStepLocked}
                          isFirst={index === 0}
                          showChevron={index === 0 && !isStepLocked}
                          isActive={isItemExpanded}
                          isCompleted={isItemCompleted}
                          onClick={(isExpanded) => handleItemClick(step.id, index, isExpanded)}
                        />
                        {index === 0 && step.id === 1 && (
                          <StepContent isActive={isItemExpanded}>
                            <Box p={5} bg="white">
                              <PaymentMethodStep
                                selected={selected}
                                onSelect={handleSelect}
                                applicationSent={applicationSent}
                              />
                            </Box>
                          </StepContent>
                        )}

                        {index === 0 && step.id === 2 && (
                          <StepContent isActive={isItemExpanded && !isStepLocked}>
                            <Box p={5} bg="white">
                              <CarInspectionContent
                                isFinancingSelected={selected === 'financing' && applicationSent}
                                isFinancingApproved={isFinancingApproved}
                                onContinue={handleContinueFromInspection}
                              />
                            </Box>
                            {selected === 'bank-transfer' && showBillingAddress && (
                              <ConnectedCarInspectionContent
                                onComplete={handleBillingComplete}
                              />
                            )}
                          </StepContent>
                        )}
                      </Box>
                    );
                  })}
                </VStack>

                {/* Only show financing specs if financing is selected and application not yet sent */}
                {step.id === 1 && selected === 'financing' && showFinancingSpecs && !applicationSent && (
                  <AnimatePresence>
                    <FinancingSpecs
                      onFinancingRequest={handleFinancingRequest}
                      onFullPayment={handleFullPayment}
                      onToggleSpecs={handleFinancingSpecsToggle}
                    />
                  </AnimatePresence>
                )}

                {/* Show radio option with "Application sent" when application is sent */}
                {step.id === 1 && selected === 'financing' && applicationSent && (
                  <AnimatePresence>
                    <FinancingUI
                      isApproved={isFinancingApproved}
                    />
                  </AnimatePresence>
                )}

                {/* Keep ConnectedFinancingUI in DOM but hide when specs are collapsed or application sent */}
                {step.id === 1 && showFinancingUI && !applicationSent && (
                  <AnimatePresence>
                    <Box display={isFinancingSpecsExpanded ? 'block' : 'none'}>
                      <ConnectedFinancingUI
                        onDecline={handleFinancingDecline}
                        onApplicationSubmit={handleApplicationSubmit}
                      />
                    </Box>
                  </AnimatePresence>
                )}
              </Box>
            );
          })}
        </VStack>
      </MotionBox>
    </Container>
  );
};



export default StepOneContent;

