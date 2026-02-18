import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const LMSNavbar = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <LinkContainer to="/"><Navbar.Brand className="fw-bold">EduLearn</Navbar.Brand></LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <LinkContainer to="/"><Nav.Link>Home</Nav.Link></LinkContainer>
            <LinkContainer to="/courses"><Nav.Link>Explore</Nav.Link></LinkContainer>
            <LinkContainer to="/student/dashboard"><Nav.Link>My Learning</Nav.Link></LinkContainer>
          </Nav>

          <Nav>
            {user ? (
              <NavDropdown title={`Hi, ${user.name}`} id="user-nav-dropdown" align="end">
                {user.role === 'admin' && (
                  <>
                    <LinkContainer to="/admin/dashboard"><NavDropdown.Item>Admin Dashboard</NavDropdown.Item></LinkContainer>
                    <LinkContainer to="/admin/users"><NavDropdown.Item>User Management</NavDropdown.Item></LinkContainer>
                    <LinkContainer to="/admin/analytics"><NavDropdown.Item>Platform Analytics</NavDropdown.Item></LinkContainer>
                    <LinkContainer to="/admin/settings"><NavDropdown.Item>System Settings</NavDropdown.Item></LinkContainer>
                    <NavDropdown.Divider />
                  </>
                )}
                {user.role === 'instructor' && (
                  <LinkContainer to="/instructor/dashboard"><NavDropdown.Item>Instructor Dashboard</NavDropdown.Item></LinkContainer>
                )}
                <LinkContainer to="/profile"><NavDropdown.Item>My Profile</NavDropdown.Item></LinkContainer>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className="text-danger fw-bold">Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <LinkContainer to="/login"><Nav.Link>Login</Nav.Link></LinkContainer>
                <LinkContainer to="/register">
                  <Button variant="outline-light" className="ms-lg-2">Register</Button>
                </LinkContainer>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default LMSNavbar;