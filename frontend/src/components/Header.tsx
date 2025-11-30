import { useState } from "react";
import {
  createStyles,
  Header,
  Container,
  Group,
  Burger,
  rem,
  Button,
  Menu,
  Avatar,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link } from "react-router-dom";
import { signIn, signOut } from "../auth/auth";
import { useAuth } from "../auth/AuthUserProvider";

const useStyles = createStyles((theme) => ({
  header: {
    display: "flex",
    justifyContent: "start",
    gap: "2rem",
    alignItems: "center",
    height: "100%",
  },

  links: {
    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("xs")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({
        variant: "light",
        color: theme.primaryColor,
      }).color,
    },
  },
}));

interface HeaderSimpleProps {
  links: { link: string; label: string }[];
}

export function HeaderSimple({ links }: HeaderSimpleProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const [active, setActive] = useState(links[0].link);
  const { classes, cx } = useStyles();
  const { user } = useAuth();

  const items = links
    // Filter out dynamic routes (like /recipe/:id)
    .filter((l) => !l.link.includes(":"))
    .map((link) => (
      <Link
        key={link.label}
        to={link.link}
        className={cx(classes.link, {
          [classes.linkActive]: active === link.link,
        })}
        onClick={() => setActive(link.link)}
      >
        {link.label}
      </Link>
    ));

  const handleSignIn = async () => {
    await signIn();
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Header height={60}>
      <Container size="xl" className={classes.header}>
        <img src="/src/assets/logo.png" alt="Logo" style={{ height: "40px" }} />

        <Group spacing={5} className={classes.links}>
          {items}
        </Group>

        <Group spacing={5} style={{ marginLeft: "auto" }}>
          {user ? (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="subtle" style={{ padding: 0 }}>
                  <Group spacing={8}>
                    <Avatar
                      src={user.photoURL}
                      alt={user.displayName || "User"}
                      radius="xl"
                      size={32}
                    />
                    <Text size="sm">{user.displayName}</Text>
                  </Group>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item onClick={handleSignOut}>Sign out</Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button onClick={handleSignIn} variant="light">
              Sign in with Google
            </Button>
          )}
        </Group>

        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
      </Container>
    </Header>
  );
}
