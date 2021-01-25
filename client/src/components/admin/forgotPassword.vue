<template>
  <div>
    <div
      id="forgotPassword"
      class="text-center"
      v-if="!verificationCodeFromServer"
    >
      <p class="blue--text headline">Recover your password in 3 steps</p>
      <p class="text-center grey--text">
        Step (1 of 3) Use your phone number to Recover or forgot your password
      </p>
      <p class="red--text" v-html="verificationError"></p>
      <v-flex xs12 md6> &nbsp;&nbsp; </v-flex>
      <v-flex xs12 md6>
        <v-text-field
          label="Phone number"
          v-model="phoneOrEmail"
          prepend-icon="phone"
        ></v-text-field>
      </v-flex>
      <v-btn
        text
        class="yellow mr-10"
        @click="forgotPassword"
        :loading="forgotCodeLoading"
      >
        <span class="text-capitalize">Check your phone number</span>
      </v-btn>
    </div>

    <div
      id="activationCode"
      class="text-center"
      v-if="verificationCodeFromServer && !phoneVerified"
    >
      <p class="blue--text headline">Step (2 of 3) Verify your phone number</p>

      <p class="text-center grey--text">
        We have sent a four digit confirmation code to your phone number
        {{ phoneOrEmail }}. Please insert it into the field bellow and verify
        your number in order to reset your password.
      </p>
      <span class="red--text" v-html="verificationError"></span>
      <p>Enter 4-digit verification code</p>
      <v-flex xs6 md6 class="ml-10">
        <v-text-field
          v-model="verificationCodeFromPhone"
          type="number"
          outlined
          :dense="true"
          label=" Enter verification code"
        ></v-text-field>
      </v-flex>
      <v-btn text dark class="blue mr-5" @click="verifyPhone">
        <span class="text-capitalize">Verify</span>
      </v-btn>

      <v-btn
        text
        class="grey lighten-5"
        @click="resendCode"
        :loading="resendCodeLoading"
      >
        <span class="text-capitalize">Resend code</span>
      </v-btn>
      <br />
      <br />
      <span right class="green--text">{{ resendCodeSuccess }}</span>
      <br />
    </div>
    <div v-if="phoneVerified" id="activationCode" class="text-center">
      <p class="blue--text headline">
        Step (3 of 3) Finaly enter new password and confirm it with the same
        password
      </p>
      <v-form autocomplete="off" v-model="checkValidity" @submit.prevent>
        <span class="red--text" v-html="verificationError"></span>
        <v-flex xs12 class="mt-5">
          <v-text-field
            :rules="passwordValidation"
            type="password"
            label="Enter new password"
            v-model="password"
            prepend-icon="lock"
          ></v-text-field>
        </v-flex>

        <v-flex xs12 class="mt-5 mr-3">
          <v-text-field
            type="password"
            :rules="checkConfirmationPass"
            label="Confirm password"
            v-model="confirmPassword"
            prepend-icon="check"
          ></v-text-field>
        </v-flex>
        <v-btn
          dark
          text
          class="blue"
          @click="resetPassword"
          :loading="loading"
          type="submit"
        >
          <span class="text-capitalize">Reset password</span>
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
import authonticationService from "../../services/apiService";
export default {
  data() {
    return {
      verificationError: "",
      phoneOrEmail: "",
      confirmPassword: "",
      password: "",
      iso2: "",

      forgotCodeLoading: false,
      verificationCodeFromServer: "",
      verificationCodeFromPhone: "",
      activationCodeLoading: false,
      resendCodeLoading: false,
      resendCodeSuccess: "",
      phoneVerified: false,
      checkValidity: false,
      loading: false,

      passwordValidation: [
        (v) =>
          /^[a-zA-Zሀ-ፐ0-9]{7,32}$/.test(v) ||
          "Please enter valid password? password must contains a-z,ሀ-ፐ,A-Z,0-9, " +
            " with minimum length of 7 characters, maximum 32 and it does not contain special characters",
      ],
      checkConfirmationPass: [
        (v) => v == this.password || "password does not maትch ",
      ],
    };
  },

  methods: {
    onSelect({ name, iso2, dialCode }) {
      this.countryName = name;
      this.phoneOrEmail = "+" + dialCode;
      this.iso2 = iso2;
    },

    async forgotPassword() {
      this.verificationError = "";
      this.verificationCodeFromServer = "";

      if (this.phoneOrEmail.length >= 10) {
        this.forgotCodeLoading = true;
        try {
          const response = await authonticationService.forgotPassword({
            phoneOrEmail: this.phoneOrEmail,
          });
          this.verificationCodeFromServer = response.data.newCode;

          this.forgotCodeLoading = false;
          window.scrollTo(0, 0);
        } catch (err) {
          this.forgotCodeLoading = false;
          if (err.response) {
            window.scrollTo(0, 0);
            this.verificationError = err.response.data.error;
            window.scrollTo(0, 0);
          } else {
            this.verificationError = "Connection to server is failed";
            window.scrollTo(0, 0);
          }
        }
      } else {
        this.verificationCodeFromServer = "";
        this.verificationError = "Please enter valid phone number";
      }
    },
    verifyPhone() {
      if (this.verificationCodeFromPhone == this.verificationCodeFromServer) {
        this.phoneVerified = true;
      } else {
        this.verificationError = "Code does not match, please try again";
      }
    },
    async resendCode() {
      this.resendCodeLoading = true;
      try {
        const response = await authonticationService.updateUser({
          phoneOrEmail: this.phoneOrEmail,
          whatToUpdate: "resendCode",
        });
        this.resendCodeLoading = false;
        this.verificationCodeFromServer = response.data.newCode;
        this.resendCodeSuccess = "Code sent";
      } catch (err) {
        this.resendCodeLoading = false;
        this.verificationError = err.response.data.error;
      }
    },
    async resetPassword() {
      this.verificationError = "";
      if (this.checkValidity && this.password == this.confirmPassword) {
        this.loading = true;
        try {
          await authonticationService.updateUser({
            phoneOrEmail: this.phoneOrEmail,
            password: this.password,
            whatToUpdate: "changePassword",
          });
          this.loading = false;
          alert("Password changed successfully! click ok to login");
          this.$router.push({ name: "login" }).catch((err) => {
            throw err;
          });
          window.scrollTo(0, 0);
        } catch (err) {
          this.loading = false;
          this.verificationError = err.response.data.error;
        }
      } else this.verificationError = "Please enter valid password";
    },
  },
};
</script>

<style scoped>
#activationCode {
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  max-width: 400px;
  margin: auto;
}
#forgotPassword {
  justify-content: center;
  justify-items: center;
  align-items: center;
  align-content: center;
  max-width: 500px;
  margin: auto;
}
</style>